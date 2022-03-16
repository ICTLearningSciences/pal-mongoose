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
const arrayToUnique = require("./utils/array-to-unique");
const Schema = mongoose.Schema;

/**
 * Subdocument for a goals
 */
const Focus = new Schema({
  _id: { type: String, required: "{PATH} is required!" },
  name: { type: String, required: "{PATH} is required!" },
  pronunciation: { type: String },
  desc: { type: String, required: "{PATH} is required!" },
  topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }]
});

Focus.plugin(require("./plugins/mongoose-no-underscore-id"));

const Goal = new Schema(
  {
    name: { type: String, required: "{PATH} is required!" },
    pronunciation: { type: String },
    desc: { type: String, required: "{PATH} is required!" },
    alias: { type: String, required: "{PATH} is required!", unique: true },
    focusList: [Focus],
    plans: [{ type: Schema.Types.ObjectId, ref: "Plan" }]
  },
  { timestamps: true }
);

Goal.plugin(require("./plugins/mongoose-find-one-by-id-or-alias"));
Goal.plugin(require("./plugins/mongoose-no-underscore-id"));
Goal.plugin(require("./plugins/mongoose-to-id"));
Goal.plugin(require("mongoose-findorcreate"));
Goal.plugin(require("mongoose-cursor-pagination").default);

Goal.methods.findAllKnowledgeComponents = async function() {
  const topicIds = this.findUniqueTopicIds();

  const topics = await mongoose
    .model("Topic")
    .find({ _id: { $in: topicIds } })
    .exec();

  return Object.getOwnPropertyNames(
    topics.reduce((acc, cur) => {
      if (!Array.isArray(cur.knowledgeComponents)) {
        return acc;
      }
      cur.knowledgeComponents.forEach(kcr => (acc[kcr.kc] = kcr.kc));
      return acc;
    }, {})
  );
};

Goal.methods.findFocusByIdOrAlias = function(idOrAlias) {
  if (!this.focusList || this.focusList.length == 0) {
    return null;
  }

  const id = this.toId(idOrAlias);

  for (let i = 0; i < this.focusList.length; i++) {
    const f = this.focusList[i];
    if (f.id === id || f.alias === idOrAlias) {
      return f;
    }
  }

  return null;
};

Goal.methods.findUniqueTopicIds = function() {
  if (!this.focusList) {
    return [];
  }
  const all = this.focusList.reduce((acc, cur) => {
    return cur.topics ? [...acc, ...cur.topics] : acc;
  }, []);
  return arrayToUnique(all);
};

module.exports = mongoose.model("Goal", Goal);
