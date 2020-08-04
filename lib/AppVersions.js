/*Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))*/
const mongoose = require("./utils/mongoose");
const Schema = mongoose.Schema;

/**
 * subdoc for a lesson the demo user has completed
 */
const Version = new Schema(
  {
    version: {
      type: String, // e.g. '1.0.0'
      required: "{PATH} is required!"
    },
    notes: {
      type: String,
      default: 1.0
    }
  },
  { timestamps: true }
);

const AppVersions = new Schema(
  {
    platform: {
      type: String, // e.g. 'ios' or 'android'
      required: "{PATH} is required!",
      unique: true
    },
    appId: {
      type: String, // e.g., the iTunes or Google Play artificial-key app id
      required: "{PATH} is required!"
    },
    appUpdateUrl: {
      type: String, // url called to launch app update on device, e.g., itms-apps://itunes.apple.com/app/id{0} for Apple App Store
      required: "{PATH} is required!"
    },
    versionMin: {
      type: String // should match one of the defined versions
    },
    versionLatest: {
      type: String // should match one of the defined versions
    },
    versions: [Version]
  },
  { timestamps: true }
);

AppVersions.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id; // don't pass id in JSON; 'platform' is the primary key
  }
});

module.exports = mongoose.model("AppVersions", AppVersions);
