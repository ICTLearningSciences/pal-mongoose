const mongoose = require("./utils/mongoose");
const shortid = require("shortid");
const createError = require("http-errors");
const Schema = mongoose.Schema;
const generateName = require("./utils/generate-name");

const DEFAULT_COHORT_MAX_TEAMS_PER_COHORT = 6;
const DEFAULT_COHORT_MAX_MEMBERS_PER_TEAM = 5;
const DEFAULT_SORT_USERS_ONTO_TEAMS = require("./utils/sort-users-onto-teams");
const DEFAULT_COHORT_TEAMS = [
  {
    name: "Minnows",
    icon: "LogoTeamRazorfish"
  },
  {
    name: "WaveMakers",
    icon: "LogoTeamZephyr"
  },
  {
    name: "Hurricane",
    icon: "LogoTeamSquall"
  },
  {
    name: "ShipsAhoy",
    icon: "LogoTeamLighthouse"
  },
  {
    name: "RedSquad",
    icon: "LogoTeamGladiator"
  },
  {
    name: "ElectricForce",
    icon: "LogoTeamFirebolt"
  }
];

mongoose.set("useFindAndModify", false); // https://github.com/Automattic/mongoose/issues/6922#issue-354147871

const GoalCohortTeam = new Schema({
  name: { type: String, required: "{PATH} is required!" },
  icon: { type: String, required: "{PATH} is required!" },
  inviteCode: { type: String, required: "{PATH} is required!", unique: true }
});

GoalCohortTeam.plugin(require("./plugins/mongoose-no-underscore-id"));
GoalCohortTeam.plugin(require("mongoose-cursor-pagination").default);
GoalCohortTeam.index({ inviteCode: 1 }, { unique: true });

const GoalCohortMember = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: "{PATH} is required!",
    index: true
  },
  teamIndex: {
    // rather that use a team ref, use index.
    // Allows for more-atomic updates
    // and more graceful cleanups in a non-transactional env
    type: Number,
    required: "{PATH} is required!",
    default: 0
  }
});

GoalCohortMember.plugin(require("./plugins/mongoose-no-underscore-id"));
GoalCohortMember.plugin(require("mongoose-cursor-pagination").default);

const GoalCohort = new Schema(
  {
    goal: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
      required: "{PATH} is required!",
      index: true
    },
    cohort: {
      type: Schema.Types.ObjectId,
      ref: "Cohort"
    },
    teams: [GoalCohortTeam],
    membersMax: { type: Number, default: 30 },
    memberSlotsRemaining: {
      // memberSlotsRemaining creates an anomoly w members.Count and membersMax
      // but necessary for efficiently finding a GoalCohort
      // that can accept new members
      type: Number,
      default: 0,
      required: "{PATH} is required!",
      index: true
    },
    members: [GoalCohortMember]
  },
  { timestamps: true }
);

GoalCohort.plugin(require("./plugins/mongoose-find-one-by-id-or-alias"));
GoalCohort.plugin(require("./plugins/mongoose-no-underscore-id"));
GoalCohort.plugin(require("./plugins/mongoose-to-id"));
GoalCohort.plugin(require("mongoose-findorcreate"));
GoalCohort.plugin(require("mongoose-cursor-pagination").default);
GoalCohort.index({ goal: 1, cohort: 1 }, { unique: true, sparse: true });

function compareCohorts(cohort1, cohort2) {
  return (!cohort1 && !cohort2) || `${cohort1}` === `${cohort2}`;
}

/**
 * Finds the GoalCohort for a user in one of the following ways:
 * 1) If the user already belongs to a cohort for the given goal, returns that GoalCohort
 */
GoalCohort.statics.findUserCohort = async function(user, goal) {
  const goalCohortModel = this;

  return await goalCohortModel.findOne({
    goal: goal.id,
    members: {
      $elemMatch: {
        user: user.id
      }
    }
  });
};

/**
 * Finds the GoalCohort for a user in one of the following ways:
 *
 * 1) If the user already belongs to a cohort for the given goal, return it
 * 2) If there is an existing cohort for the goal that can accept additional members,
 *		adds the user to that cohort and returns it
 * 3) If neither of the above, creates a new GoalCohort
 *		and adds the user as its first member
 * 4) If the user is in a user cohort, join or create a GoalCohort with that name
 * 5) If the user is not in a user cohort, join or create a GoalCohort without a name
 */
GoalCohort.statics.joinOrCreate = async function(user, goal, opts) {
  const goalCohortModel = this;
  const userCohortModel = mongoose.model("UserCohort");
  const userCohort = await userCohortModel.findForUser(user);
  const cohort = userCohort ? userCohort.cohort : undefined;

  let goalCohort = await goalCohortModel.findUserCohort(user, goal);
  if (goalCohort) {
    if (compareCohorts(goalCohort.cohort, cohort)) {
      return goalCohort;
    }
    // In a different cohort, so leave old cohort
    goalCohort = await goalCohortModel.leaveCohort(user, goal);
  }

  if (cohort) {
    goalCohort = await goalCohortModel.findOne({ cohort: cohort, goal: goal });
    // Named cohort is full, so create a new team with a random name
    if (goalCohort && goalCohort.memberSlotsRemaining === 0) {
      return await goalCohortModel.createTeam(user, goal, generateName());
    }
  }

  opts = opts || {};
  const newCohortTeams = opts.new_cohort_teams || DEFAULT_COHORT_TEAMS;
  const newCohortMaxMembersPerTeam =
    opts.new_cohort_max_members_per_team || DEFAULT_COHORT_MAX_MEMBERS_PER_TEAM;
  const newCohortMaxMembers =
    newCohortMaxMembersPerTeam * newCohortTeams.length;

  goalCohort = await goalCohortModel.findOneAndUpdate(
    {
      goal: goal.id,
      cohort: cohort,
      memberSlotsRemaining: { $gt: 0 }
    },
    {
      // if finds a cohort w space, push the user into team -1
      // repair them to a new team in subsequent update
      $push: {
        members: {
          user: user.id,
          teamIndex: -1
        }
      },
      $inc: {
        memberSlotsRemaining: -1
      },
      $setOnInsert: {
        // if new cohort, create a team and put the user on it
        goal: goal.id,
        cohort: cohort,
        teams: newCohortTeams,
        membersMax: newCohortMaxMembers
      }
    },
    {
      new: true, // return the updated doc rather than pre update
      upsert: true // insert if no cohort found
    }
  );

  // We're in the case of having a newly created cohort
  // repair memberSlotsRemaining and generate team invite codes
  if (goalCohort.memberSlotsRemaining === -1) {
    await goalCohortModel.findByIdAndUpdate(goalCohort.id, {
      $set: {
        memberSlotsRemaining: newCohortMaxMembers - 1
      }
    });
    goalCohort = await goalCohortModel.invite(user, goal);
  }

  const sortUsersOntoTeams =
    opts.sort_users_onto_teams || DEFAULT_SORT_USERS_ONTO_TEAMS;
  const membersSorted = sortUsersOntoTeams(
    goalCohort.members,
    goalCohort.teams.length
  );

  // find all the members whose team has changed
  // add an update for each in the syntax of mongo's $set operator
  // will look like this:
  // { 'members.5.teamIndex': 1, 'members.11.teamIndex':2 }
  const changesAsSet = membersSorted.reduce((acc, cur, i) => {
    if (goalCohort.members[i].teamIndex === membersSorted[i].teamIndex) {
      // ignore members whose team hasn't changed
      return acc;
    }
    acc[`members.${i}.teamIndex`] = membersSorted[i].teamIndex;
    return acc;
  }, {});

  return await goalCohortModel.findByIdAndUpdate(
    goalCohort.id,
    {
      $set: changesAsSet
    },
    {
      new: true // return the updated doc rather than pre update
    }
  );
};

GoalCohort.statics.joinWithInvite = async function(user, goal, code) {
  const goalCohortModel = this;
  const userCohortModel = mongoose.model("UserCohort");
  const userCohort = await userCohortModel.findForUser(user);
  const cohort = userCohort ? userCohort.cohort : undefined;

  const curCohort = await goalCohortModel.findUserCohort(user, goal);
  if (curCohort) {
    const _user = curCohort.members.find(m => m.user.equals(user.id));
    const _team = curCohort.teams[_user.teamIndex];

    // if user is already in the correct team, return it
    if (_team.inviteCode === code && compareCohorts(curCohort.cohort, cohort)) {
      return curCohort;
    }
  }

  const goalCohort = await goalCohortModel.findOne({
    goal: goal.id,
    teams: {
      $elemMatch: {
        inviteCode: code
      }
    }
  });

  if (!goalCohort) {
    const err = new Error(`failed to find team with invite code`);
    err.status = 404;
    throw err;
  }

  if (goalCohort.memberSlotsRemaining === 0) {
    const err = new Error(`The cohort cannot accept any more members`);
    err.status = 409;
    throw err;
  }

  if (!compareCohorts(goalCohort.cohort, cohort)) {
    const err = new Error(
      `The team is in a different cohort than the one you are assigned to`
    );
    err.status = 409;
    throw err;
  }

  if (curCohort) {
    const _user = curCohort.members.find(m => m.user.equals(user.id));
    const _team = curCohort.teams[_user.teamIndex];

    // if user is in a different team or cohort, leave it
    if (
      _team.inviteCode !== code ||
      !compareCohorts(curCohort.cohort, cohort)
    ) {
      await goalCohortModel.leaveCohort(user, goal);
    }
  }

  const teamIdx = goalCohort.teams.findIndex(t => t.inviteCode === code);

  return await goalCohortModel.findOneAndUpdate(
    {
      _id: goalCohort._id,
      memberSlotsRemaining: { $gt: 0 }
    },
    {
      $push: {
        members: {
          user: user.id,
          teamIndex: teamIdx
        }
      },
      $inc: {
        memberSlotsRemaining: -1
      }
    },
    {
      new: true, // return the updated doc rather than pre update
      upsert: true // insert if no cohort found
    }
  );
};

GoalCohort.statics.createTeam = async function(user, goal, teamname) {
  const goalCohortModel = this;
  const userCohortModel = mongoose.model("UserCohort");
  const userCohort = await userCohortModel.findForUser(user);
  const cohort = userCohort ? userCohort.cohort : undefined;

  let goalCohort = await goalCohortModel.findUserCohort(user, goal);
  // if user is already in a cohort, leave it
  if (goalCohort) {
    await goalCohortModel.leaveCohort(user, goal);
  }

  goalCohort = await goalCohortModel.findOne({
    goal: goal.id,
    cohort: cohort,
    membersMax: {
      $lt: cohort
        ? Number.MAX_SAFE_INTEGER
        : DEFAULT_COHORT_MAX_MEMBERS_PER_TEAM *
          DEFAULT_COHORT_MAX_TEAMS_PER_COHORT
    },
    memberSlotsRemaining: { $gt: cohort ? -1 : 0 }
  });

  let teamIndex = 0;
  let teamIcon = "LogoTeamRazorfish";

  if (goalCohort) {
    if (goalCohort.teams.find(x => x.name === teamname)) {
      throw createError(
        409,
        `Cohort already has a team ${teamname}. Please pick a different name`
      );
    }
    teamIndex = goalCohort.teams.length;
    teamIcon =
      DEFAULT_COHORT_TEAMS[
        goalCohort.teams.length % DEFAULT_COHORT_MAX_TEAMS_PER_COHORT
      ].icon;
  }

  return await goalCohortModel.findOneAndUpdate(
    {
      goal: goal.id,
      cohort: cohort,
      membersMax: {
        $lt: cohort
          ? Number.MAX_SAFE_INTEGER
          : DEFAULT_COHORT_MAX_MEMBERS_PER_TEAM *
            DEFAULT_COHORT_MAX_TEAMS_PER_COHORT
      },
      memberSlotsRemaining: { $gt: cohort ? -1 : 0 }
    },
    {
      $push: {
        members: {
          user: user.id,
          teamIndex: teamIndex
        },
        teams: {
          name: teamname,
          icon: teamIcon,
          inviteCode: shortid.generate()
        }
      },
      $inc: {
        memberSlotsRemaining: DEFAULT_COHORT_MAX_MEMBERS_PER_TEAM - 1,
        membersMax: DEFAULT_COHORT_MAX_MEMBERS_PER_TEAM
      },
      $setOnInsert: {
        goal: goal.id
      }
    },
    {
      new: true, // return the updated doc rather than pre update
      upsert: true // insert if no cohort found
    }
  );
};

GoalCohort.statics.leaveCohort = async function(user, goal) {
  const goalCohortModel = this;

  const cohort = await goalCohortModel.findUserCohort(user, goal);
  if (!cohort) {
    const err = new Error(`user is not in a cohort`);
    err.status = 404;
    throw err;
  }

  return await goalCohortModel.findOneAndUpdate(
    {
      _id: cohort.id
    },
    {
      $pull: {
        members: {
          user: user.id
        }
      },
      $inc: {
        memberSlotsRemaining: 1
      }
    },
    {
      new: true // return the updated doc rather than pre update
    }
  );
};

GoalCohort.statics.invite = async function(user, goal) {
  const goalCohortModel = this;

  const cohort = await goalCohortModel.findOne({
    goal: goal.id,
    members: {
      $elemMatch: {
        user: user.id
      }
    }
  });

  if (!cohort) {
    const err = new Error("user is not in a cohort");
    err.status = 404;
    throw err;
  }

  const changesAsSet = cohort.teams.reduce((acc, cur, i) => {
    if (cohort.teams[i].inviteCode) {
      return acc;
    }
    acc[`teams.${i}.inviteCode`] = shortid.generate();
    return acc;
  }, {});

  return await goalCohortModel.findByIdAndUpdate(
    cohort.id,
    {
      $set: changesAsSet
    },
    {
      new: true
    }
  );
};

GoalCohort.statics.kickMember = async function(user, goal, memberId) {
  const goalCohortModel = this;

  const cohort = await goalCohortModel.findUserCohort(user, goal);
  if (!cohort) {
    const err = new Error(`user is not in a cohort`);
    err.status = 404;
    throw err;
  }

  const member = cohort.members.find(m => m.user.equals(memberId));
  if (!member) {
    const err = new Error(`member is not in user's cohort`);
    err.status = 404;
    throw err;
  }

  const memberTeam = member.teamIndex;
  const userTeam = cohort.members.find(m => m.user.equals(user.id)).teamIndex;

  if (memberTeam != userTeam) {
    const err = new Error(`member is not in user's team`);
    err.status = 404;
    throw err;
  }

  return await goalCohortModel.findOneAndUpdate(
    {
      _id: cohort.id
    },
    {
      $pull: {
        members: {
          user: memberId
        }
      },
      $inc: {
        memberSlotsRemaining: 1
      }
    },
    {
      new: true // return the updated doc rather than pre update
    }
  );
};

module.exports = mongoose.model("GoalCohort", GoalCohort);
