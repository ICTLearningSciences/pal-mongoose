const mongoose = require("./utils/mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const UserCohort = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "{PATH} is required!",
      unique: true
    },
    cohort: { type: String }
  },
  { timestamps: true }
);
UserCohort.plugin(require("./plugins/mongoose-to-id"));
UserCohort.plugin(require("mongoose-findorcreate"));
UserCohort.plugin(require("./plugins/mongoose-no-underscore-id"));

UserCohort.statics.findForUser = async function(user) {
  if (!(user instanceof User)) {
    throw new Error("user param must be a User instance");
  }
  return await this.findOne({ user: user.id }).exec();
};

UserCohort.statics.setUserCohort = async function(user, cohortName) {
  if (!(user instanceof User)) {
    throw new Error("user param must be a User instance");
  }

  const UserCohortModel = this;
  let UserCohort = await UserCohortModel.findForUser(user);
  if (UserCohort && UserCohort.cohort === cohortName) {
    return UserCohort;
  }

  UserCohort = await UserCohortModel.findOneAndUpdate(
    { user: user.id },
    {
      user: user.id,
      cohort: cohortName
    },
    { upsert: true, new: true }
  ).exec();

  // Leave previous cohorts
  const goalModel = mongoose.model("Goal");
  const goalCohortModel = mongoose.model("GoalCohort");
  const goals = await goalModel.find({});
  for (let i = 0; i < goals.length; i++) {
    const goal = goals[i];
    const goalCohort = await goalCohortModel.findUserCohort(user, goal);
    if (goalCohort) {
      await goalCohortModel.leaveCohort(user, goal);
    }
  }

  return UserCohort;
};
module.exports = mongoose.model("UserCohort", UserCohort);
