/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
/**
 * A DemoUser record holds special info related to demo users,
 * specifically what learner records the user has in abbreviated form,
 * e.g. lessons-completed, knowledge-component mastery etc
 */
const mongoose = require("./utils/mongoose");
const Schema = mongoose.Schema;

/**
 * subdoc for a lesson the demo user has completed
 */
const DemoUserLesson = new Schema({
  lesson: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: "{PATH} is required!"
  },
  score: {
    type: Number,
    default: 1.0
  }
});

/**
 * subdoc for a knowledge component for which the demo user has a mastery score
 */
const DemoUserKnowledge = new Schema({
  kc: {
    type: Schema.Types.ObjectId,
    ref: "KnowledgeComponent",
    required: "{PATH} is required!"
  },
  score: {
    type: Number,
    default: 1.0
  }
  // TODO: add decay params @see UserKnowledgeComponent
});

const DemoUser = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "{PATH} is required!",
      unique: true
    },
    goal: {
      type: Schema.Types.ObjectId,
      ref: "Goal"
    },
    focus: {
      type: String
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic"
    },
    // TODO: specify focus and topic for goal (if needed?)
    lessons: [DemoUserLesson],
    kcs: [DemoUserKnowledge]
  },
  { timestamps: true }
);

DemoUser.plugin(require("./plugins/mongoose-to-id"));
DemoUser.plugin(require("mongoose-findorcreate"));
DemoUser.plugin(require("./plugins/mongoose-no-underscore-id"));

module.exports = mongoose.model("DemoUser", DemoUser);
