// const mongoose = require("./utils/mongoose");
// const Schema = mongoose.Schema;
import mongoose, { Schema, Document } from "mongoose";
import KnowledgeComponentRelevanceSchema, {
  KnowledgeComponentRelevance
} from "./schema/KnowledgeComponentRelevance";

export interface Resource extends Document {
  alias: string;
  pronunciation: string;
  assets: {
    name: string;
    type: string;
    uri: string;
  }[];
  contentType: string;
  duration: number;
  isCmiAU: boolean;
  explorationLevel: number;
  knowledgeComponents: KnowledgeComponentRelevance[];
  name: string;
  type: string;
  uri: string;
}

export const AssetSchema = new Schema({
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
AssetSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
  }
});

export const ResourceSchema = new Schema(
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
    assets: [AssetSchema],
    knowledgeComponents: [KnowledgeComponentRelevanceSchema],
    // set TRUE to have xapi statements created by external/cmi5 resources passed to client with activity-type 'cmi5-au'
    isCmiAU: { type: Boolean, index: true, sparse: true }
  },
  { timestamps: true }
);

ResourceSchema.plugin(require("./plugins/mongoose-find-one-by-id-or-alias"));
ResourceSchema.plugin(require("./plugins/mongoose-no-underscore-id"));
ResourceSchema.plugin(require("mongoose-findorcreate"));
ResourceSchema.plugin(require("mongoose-cursor-pagination").default);

export default mongoose.model<Resource>("Resource", ResourceSchema);
