/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
const mongoose = require("../utils/mongoose");
const isHex = require("is-hex");

/**
 * Find one record given a key which may be the _id for the record or an alias
 */
function findOneByIdOrAlias(schema) {
  /**
   * @param idOrAlias: the key to find, which may be an id (string or mongoose.Types.ObjectId) or an alias
   * @param fields: the select for the query, e.g. SomeModel.find(conditions).select(fields)... (optional)
   * @param callback - (optional) function(err, doc)
   * @return if callback passed, void if no callback passed, the query
   */
  schema.statics.findOneByIdOrAlias = function(idOrAlias, fields, callback) {
    if (typeof fields === "function") {
      // Scenario: findWithLimit(conditions, callback)
      callback = fields;
      fields = null;
    }
    let id = null;
    if (idOrAlias instanceof mongoose.Types.ObjectId) {
      id = idOrAlias;
    } else if (idOrAlias.length === 24 && isHex(idOrAlias)) {
      try {
        id = mongoose.Types.ObjectId(idOrAlias);
      } catch (castErr) {
        console.log(`cast error for id '${idOrAlias}': ${castErr}`);
      }
    }
    let query = id
      ? this.findOne({ $or: [{ _id: id }, { alias: idOrAlias }] })
      : this.findOne({ alias: idOrAlias });
    if (fields) {
      fields = fields.replace(/,/g, " ");
      query = query.select(fields);
    }
    return query.exec(callback);
  };
}

module.exports = findOneByIdOrAlias;
