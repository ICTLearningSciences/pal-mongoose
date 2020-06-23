// const mongoose = require("./utils/mongoose");
// const Schema = mongoose.Schema;
import mongoose, { Schema, Document } from "mongoose";
import KnowledgeComponentRelevanceSchema, {
  KnowledgeComponentRelevance
} from "./schema/KnowledgeComponentRelevance";
const handlePromiseOrCallback = require("./utils/handle-promise-or-callback");

export interface Topic extends Document {
  alias: string;
  pronunciation: string;
  name: string;
  recommender: string;
  knowledgeComponents: KnowledgeComponentRelevance[];
  prerequisiteTopics: mongoose.Types.ObjectId[];
}

export const TopicSchema = new Schema(
  {
    name: { type: String, required: "{PATH} is required!" },
    alias: { type: String, required: "{PATH} is required!", unique: true },
    pronunciation: { type: String },
    recommender: { type: String },
    knowledgeComponents: [KnowledgeComponentRelevanceSchema],
    prerequisiteTopics: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic"
      }
    ]
  },
  { timestamps: true }
);

TopicSchema.plugin(require("./plugins/mongoose-find-one-by-id-or-alias"));
TopicSchema.plugin(require("./plugins/mongoose-no-underscore-id"));
TopicSchema.plugin(require("mongoose-findorcreate"));
TopicSchema.plugin(require("mongoose-cursor-pagination").default);

TopicSchema.methods.findLessons = function(fields: any, callback: any) {
  if (typeof fields === "function") {
    callback = fields;
    fields = null;
  }
  const lessonModel = mongoose.model("Lesson");
  const promise = new Promise((resolve, reject) => {
    let query = lessonModel
      .find({
        topic: this._id,
        ord: { $gte: 0 },
        deleted: { $ne: true }
      })
      .sort({ ord: 1 });
    if (fields) {
      query = query.select(fields);
    }
    query.exec((err, item) => {
      if (err) {
        reject(err);
      } else {
        resolve(item);
      }
    });
  });
  return handlePromiseOrCallback(promise, callback);
};

export default mongoose.model<Topic>("Topic", TopicSchema);
