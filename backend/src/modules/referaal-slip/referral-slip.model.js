import { gender } from "#utils/constants.js";
import { generateId } from "#utils/crypto.js";
import mongoose from "mongoose";

const ReferralSlipSchema = new mongoose.Schema({
  rsId: { type: String, unique: true, index: true, required: false },


  referralSlip: {
    to: { type: String, required: true },
    date: { type: Date, required: true },
    agency: { type: String, required: false },
    address: { type: String, required: false },
    name: { type: String, required: true },
    age: { type: Number, required: false },
    sex: { type: String, enum: gender, required: false },
    addressOrSchool: { type: String, required: false },
    grade: { type: String, required: false },
    chiefComplaint: { type: String, required: false },
    impression: { type: String, required: false },
    remarks: { type: String, required: false },
    referrerName: { type: String, required: false },
    referrerDesignation: { type: String, required: false },
    signatureString: { type: String, required: false }
  },

  returnSlip: {
    returnedTo: { type: String, required: false },
    nameOfPatient: { type: String, required: false },
    dateReferred: { type: Date, required: false },
    chiefComplaint: { type: String, required: false },
    findings: { type: String, required: false },
    actionOrRecommendations: { type: String, required: false },
    date: { type: Date, required: false },
    signatureName: { type: String, required: false },
    designation: { type: String, required: false },
    signatureString: { type: String, required: false }
  },

  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: {
    type: Date
  },
}, {
  timestamps: true
});
ReferralSlipSchema.pre('save', function (next) {
  if (this.isNew) {
    this.rsId = generateId("RS")
  }
  next();
});
ReferralSlipSchema.methods.softDelete = async function (userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return await this.save();
};

ReferralSlipSchema.methods.restore = async function () {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  return await this.save();
};

ReferralSlipSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  return obj;
};

ReferralSlipSchema.methods.isReturnSlipComplete = function () {
  return !!(this.returnSlip && this.returnSlip.findings && this.returnSlip.actionOrRecommendations);
};

export default mongoose.model("ReferralSlip", ReferralSlipSchema);
