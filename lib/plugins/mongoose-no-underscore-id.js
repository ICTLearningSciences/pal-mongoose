const mongoose = require('../mongoose');

/**
 * make a model's json return 'id' instead of default '_id'
 *
 */
function noUnderscoreId(schema, options) {
  // Duplicate the ID field.
  schema.virtual('id').get(function() {
    return this._id;
  });

  // Ensure virtual fields are serialized.
  schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, opts) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  });
}

module.exports = noUnderscoreId;
