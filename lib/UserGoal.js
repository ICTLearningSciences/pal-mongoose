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
const Goal = require("./Goal");
const User = require("./User");
const UserGoal = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "{PATH} is required!",
      unique: true
    },
    activeGoal: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
      required: "{PATH} is required!",
      index: true
    },
    activeFocus: {
      type: String,
      ref: "Goal.focusList",
      required: "{PATH} is required!",
      index: true
    }
  },
  { timestamps: true }
);

UserGoal.plugin(require("./plugins/mongoose-to-id"));
UserGoal.plugin(require("mongoose-findorcreate"));
UserGoal.plugin(require("./plugins/mongoose-no-underscore-id"));
UserGoal.plugin(require("mongoose-cursor-pagination").default);

UserGoal.statics.findForUser = async function(user) {
  if (!(user instanceof User)) {
    throw new Error("user param must be a User instance");
  }
  return await this.findOne({ user: user.id }).exec();
};

UserGoal.statics.saveGoalAndFocus = async function(user, goalId, focusId) {
  if (!(user instanceof User)) {
    throw new Error("user param must be a User instance");
  }
  const userGoalModel = this;
  const goal = await Goal.findOneByIdOrAlias(goalId);
  if (!goal) {
    throw new Error(`no such goal: ${goalId}`);
  }
  const focus = focusId ? goal.findFocusByIdOrAlias(focusId) : null;
  const userGoal = await userGoalModel
    .findOneAndUpdate(
      { user: user.id },
      {
        user: user.id,
        activeGoal: goal ? goal.id : undefined,
        activeFocus: focus ? focus.id : undefined
      },
      { upsert: true, new: true }
    )
    .exec();
  return userGoal;
};
module.exports = mongoose.model("UserGoal", UserGoal);
