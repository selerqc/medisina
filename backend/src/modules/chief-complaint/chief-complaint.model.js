import mongoose from "mongoose";
import { generateId } from "#utils/crypto.js";
const ChiefComplaintSchema = new mongoose.Schema({
  ccId: { type: String },
  personnel: { type: mongoose.Schema.Types.ObjectId, ref: "Personnel", required: true },
  complaint: { type: String, required: true },
  findings: { type: String },
  treatmentOrRecommendation: { type: String },

  isApproved: { type: Boolean, default: false, index: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },

  attachmentUrl: { type: String, default: "" },
  attachmentName: { type: String, default: "" },
  attachmentType: { type: String, default: "" },
  attachmentSize: { type: Number, default: 0 },
  attachmentMimeType: { type: String, default: "" },
  cloudinaryPublicId: { type: String, default: "" },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true, versionKey: false },
  toObject: { virtuals: true },
  collection: "chief_complaint"
});
ChiefComplaintSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    this.ccId = generateId('CC')
    next();
  } catch (err) {
    next(err);
  }
}


);

export default mongoose.model("ChiefComplaint", ChiefComplaintSchema);
