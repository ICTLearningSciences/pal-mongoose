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

/**
 * Subdocuments
 */

const Condition = new Schema({
  variable: { type: String },
  operator: { type: String },
  value: { type: Number }
});

const Delta = new Schema({
  variableName: { type: String },
  delta: { type: Number }
});

const ChoiceEvent = new Schema({
  type: { type: String },
  value: { type: String }
});

const Choice = new Schema({
  text: { type: String },
  deltas: [Delta],
  event: ChoiceEvent
});

const LikertScaleEntry = new Schema({
  text: { type: String },
  deltas: [Delta],
  event: ChoiceEvent,
  number: { type: Number }
});

const LikertQuestion = new Schema({
  palText: [{ type: String }],
  palAudio: [{ type: String }],
  question: { type: String },
  preconditions: [Condition],
  likertScale: [LikertScaleEntry]
});

const MCQuestion = new Schema({
  palText: [{ type: String }],
  palAudio: [{ type: String }],
  question: { type: String },
  preconditions: [Condition],
  choices: [Choice],
  randomizeChoices: { type: Boolean }
});

const Survey = new Schema(
  {
    alias: { type: String, required: "{PATH} is required!" },
    displayName: { type: String },
    questions: [MCQuestion | LikertQuestion],
    specialEventConditions: [Condition]
  },
  { timestamps: true }
);

Survey.plugin(require("./plugins/mongoose-to-id"));
Survey.plugin(require("mongoose-findorcreate"));
Survey.plugin(require("mongoose-cursor-pagination").default);

module.exports = mongoose.model("Survey", Survey);
