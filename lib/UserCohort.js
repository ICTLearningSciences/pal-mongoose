const mongoose = require("./utils/mongoose");
const Schema = mongoose.Schema;
const Cohort = require("./Cohort");
const User = require("./User");

const UserCohort = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "{PATH} is required!",
      unique: true
    },
    cohort: {
      type: Schema.Types.ObjectId,
      ref: "Cohort"
    }
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

  const userCohortModel = this;
  const cohort = await Cohort.findOrCreateForName(cohortName);
  let userCohort = await userCohortModel.findForUser(user);

  if (
    userCohort &&
    userCohort.cohort &&
    `${cohort._id}` === `${userCohort.cohort._id}`
  ) {
    return userCohort;
  }

  userCohort = await userCohortModel
    .findOneAndUpdate(
      { user: user.id },
      {
        user: user.id,
        cohort: cohort.id
      },
      { upsert: true, new: true }
    )
    .exec();

  // Check if user is in any goal cohorts
  const goalCohortModel = mongoose.model("GoalCohort");
  const goalCohorts = await goalCohortModel.find({
    members: {
      $elemMatch: {
        user: user.id
      }
    }
  });
  if (goalCohorts.length === 0) {
    return userCohort;
  }

  // Leave old cohorts
  const goalModel = mongoose.model("Goal");
  const goalList = await goalModel.find({
    _id: { $in: goalCohorts.map(g => g.goal) }
  });
  const leavePromises = goalList.map(g => goalCohortModel.leaveCohort(user, g));
  try {
    await Promise.all(leavePromises);
  } catch (err) {
    console.log(err);
  }
  return userCohort;
};

module.exports = mongoose.model("UserCohort", UserCohort);
