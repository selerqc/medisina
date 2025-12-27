import mongoose from "mongoose";
import { generateId } from "#utils/crypto.js";
import { prescriptionClassification } from "#utils/constants.js";

const MedicationSchema = new mongoose.Schema({
  itemNumber: { type: Number, required: true },
  medicationName: { type: String, required: true, trim: true },
  signature: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true },
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema({
  prescriptionId: { type: String, unique: true, index: true },

  doctorName: { type: String, trim: true },
  doctorTitle: { type: String, trim: true },
  doctorSpecialty: { type: String, trim: true },
  clinicAddress: { type: String, trim: true },
  licenseNumber: { type: String, trim: true },

  patientName: { type: String, required: true, trim: true },
  patientAge: { type: Number },
  patientSex: { type: String, enum: ['Male', 'Female', ''] },
  patientAddress: { type: String, trim: true },

  classification: {
    type: String,
    trim: true
  },

  medications: [MedicationSchema],

  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  prescribedDate: { type: Date, default: Date.now },

  notes: { type: String, trim: true },
  attendingExaminer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  signatureString: { type: String, trim: true },
  isDeleted: { type: Boolean, default: false, },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
  timestamps: true,
  collection: "prescriptions"
});

PrescriptionSchema.index({ prescribedDate: -1 });
PrescriptionSchema.index({ patientName: 1 });
PrescriptionSchema.index({ isDeleted: 1 });
PrescriptionSchema.index({ doctorName: 1 });

PrescriptionSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    this.prescriptionId = generateId('PRX');
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Prescription", PrescriptionSchema);
