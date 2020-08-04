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
const KnowledgeComponentRelevance = require("./schema/KnowledgeComponentRelevance");

const Asset = new Schema({
  name: {
    type: String,
    required: "{PATH} is required!"
  },
  type: {
    type: String,
    required: "{PATH} is required!"
  },
  uri: {
    type: String,
    required: "{PATH} is required!"
  }
});

// these are embedded docs and clients have no reason to know their db ids
Asset.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
  }
});

const Resource = new Schema(
  {
    name: { type: String, required: "{PATH} is required!" },
    alias: { type: String, required: "{PATH} is required!", unique: true },
    pronunciation: { type: String },
    // type is really the launch type, e.g. web
    type: { type: String, required: "{PATH} is required!", index: true },
    // contentType is the exact content type--e.g. mentorpal is a contentType where the 'type' (launch type) is 'web'
    contentType: { type: String, required: "{PATH} is required!", index: true },
    uri: { type: String, required: "{PATH} is required!", index: true }, // TODO: probably better to have a 'data' object which could be a string or properties
    explorationLevel: { type: Number, default: 0 },
    duration: { type: Number, default: 60 },
    assets: [Asset],
    knowledgeComponents: [KnowledgeComponentRelevance],
    // set TRUE to have xapi statements created by external/cmi5 resources passed to client with activity-type 'cmi5-au'
    isCmiAU: { type: Boolean, index: true, sparse: true }
  },
  { timestamps: true }
);

Resource.plugin(require("./plugins/mongoose-find-one-by-id-or-alias"));
Resource.plugin(require("./plugins/mongoose-no-underscore-id"));
Resource.plugin(require("mongoose-findorcreate"));
Resource.plugin(require("mongoose-cursor-pagination").default);

module.exports = mongoose.model("Resource", Resource);
