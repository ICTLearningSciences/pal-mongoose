// const mongoose = require("../utils/mongoose");
// const Schema = mongoose.Schema;
import mongoose, { Schema, Document } from "mongoose";

export interface KnowledgeComponentRelevance extends Document {
  kc: mongoose.Types.ObjectId;
  relevance: number;
}

export const KnowledgeComponentRelevanceSchema = new Schema({
  kc: {
    type: Schema.Types.ObjectId,
    ref: "KnowledgeComponent",
    required: "{PATH} is required!",
    index: true
  },
  relevance: {
    type: Number,
    min: 0,
    max: 1,
    default: 1
  }
});

// these are embedded docs and clients have no reason to know their db ids
KnowledgeComponentRelevanceSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
  }
});

export default mongoose.model<KnowledgeComponentRelevance>(
  "KnowledgeComponentRelevance",
  KnowledgeComponentRelevanceSchema
);
