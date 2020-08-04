/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
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
UserCohort.plugin(require("mongoose-cursor-pagination").default);

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
