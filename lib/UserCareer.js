const mongoose = require("./utils/mongoose");
const Schema = mongoose.Schema;
const UserCareer = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "{PATH} is required!",
      unique: true
    },
    isConfirmed: { type: Boolean }
  },
  { timestamps: true }
);

UserCareer.plugin(require("./plugins/mongoose-to-id"));
UserCareer.plugin(require("mongoose-findorcreate"));
UserCareer.plugin(require("./plugins/mongoose-no-underscore-id"));
UserCareer.plugin(require("mongoose-cursor-pagination").default);

module.exports = mongoose.model("UserCareer", UserCareer);
