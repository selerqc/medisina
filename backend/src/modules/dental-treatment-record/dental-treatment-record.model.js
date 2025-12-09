import mongoose from "mongoose";
import { generateId } from "#utils/crypto.js";

const DentalTreatmentRecordSchema = new mongoose.Schema({
  dtrId: { type: String, unique: true, index: true },

  patientType: {
    type: String,
    enum: ['student', 'personnel', 'walk-in'],
    required: true
  },

  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  personnel: { type: mongoose.Schema.Types.ObjectId, ref: "Personnel" },

  walkIn: {
    name: { type: String, trim: true },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] }
  },

  treatments: [{
    date: { type: Date, required: true },
    toothNo: { type: String, trim: true }, // Can be single tooth or multiple (e.g., "12, 13, 14")
    procedure: { type: String, required: true, trim: true },
    dentist: { type: String, trim: true },
    amountCharged: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    nextAppointment: { type: Date }
  }],

  // Metadata
  schoolId: { type: String, trim: true },
  attendedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isDeleted: { type: Boolean, default: false, index: true },
}, {
  timestamps: true,
  collection: "dental_treatment_records",
});

// Indexes
DentalTreatmentRecordSchema.index({ student: 1 });
DentalTreatmentRecordSchema.index({ personnel: 1 });
DentalTreatmentRecordSchema.index({ schoolId: 1 });
DentalTreatmentRecordSchema.index({ 'treatments.date': -1 });

// Pre-save hook to generate ID
DentalTreatmentRecordSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    this.dtrId = generateId('DTR');
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("DentalTreatmentRecord", DentalTreatmentRecordSchema);
