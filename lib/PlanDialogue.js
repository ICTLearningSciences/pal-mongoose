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

const Validation = new Schema({
  regex: { type: String },
  requiredRegex: { type: String },
  wordCount: { type: Number },
  minWordCount: { type: Number },
  characterCount: { type: Number },
  minCharacterCount: { type: Number }
});

/**
 * Subdocument for a the question
 */
const Question = new Schema({
  question: { type: String, required: "{PATH} is required!" },
  section: { type: Number, required: "{PATH} is required!" },
  field: { type: Number, required: "{PATH} is required!" },
  entry: { type: Number, required: "{PATH} is required!" },
  validation: { type: Validation }
});

const PlanDialogue = new Schema(
  {
    alias: { type: String, required: "{PATH} is required!", unique: true },
    name: { type: String, required: "{PATH} is required!" },
    plan: { type: String, required: "{PATH} is required!" },
    introduction: { type: String },
    conclusion: { type: String },
    questions: { type: [Question], required: "{PATH} is required!" }
  },
  { timestamps: true }
);

PlanDialogue.plugin(require("./plugins/mongoose-find-one-by-id-or-alias"));
PlanDialogue.plugin(require("./plugins/mongoose-no-underscore-id"));
PlanDialogue.plugin(require("mongoose-findorcreate"));
PlanDialogue.plugin(require("mongoose-cursor-pagination").default);

module.exports = mongoose.model("PlanDialogue", PlanDialogue);