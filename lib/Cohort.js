const mongoose = require("./utils/mongoose");
const Schema = mongoose.Schema;
const canonicalize = require("./utils/canonicalize");

const Cohort = new Schema(
  {
    name: { type: String },
    nameCanonical: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      sparse: true,
      trim: true
    }
  },
  { timestamps: true }
);

Cohort.plugin(require("./plugins/mongoose-to-id"));
Cohort.plugin(require("mongoose-findorcreate"));
Cohort.plugin(require("./plugins/mongoose-no-underscore-id"));
Cohort.plugin(require("mongoose-cursor-pagination").default);

Cohort.statics.findForName = async function(name) {
  return await this.findOne({ nameCanonical: canonicalize(name) }).exec();
};

Cohort.statics.findOrCreateForName = async function(name) {
  const CohortModel = this;
  const cohort = await CohortModel.findForName(name);
  if (cohort) {
    return cohort;
  }

  return await CohortModel.findOneAndUpdate(
    {
      nameCanonical: canonicalize(name)
    },
    {
      name: name,
      nameCanonical: canonicalize(name)
    },
    { upsert: true, new: true }
  ).exec();
};

module.exports = mongoose.model("Cohort", Cohort);
