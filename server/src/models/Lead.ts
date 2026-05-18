import { Schema, model, type Types } from "mongoose";
import { leadSources, leadStatuses, type LeadSource, type LeadStatus } from "../types/enums.js";

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, enum: leadStatuses, default: "New", index: true },
    source: { type: String, enum: leadSources, required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }
  },
  { timestamps: true }
);

leadSchema.index({ name: "text", email: "text" });
leadSchema.index({ createdAt: -1 });

export const Lead = model<ILead>("Lead", leadSchema);
