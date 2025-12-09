import mongoose from "mongoose";
import { generateId } from '#utils/crypto.js';
const FamilyHistorySchema = new mongoose.Schema({
  hypertension: { type: Boolean },
  cardiovascularDisease: { type: Boolean },
  diabetesMellitus: { type: Boolean },
  kidneyDisease: { type: Boolean },
  cancer: { type: Boolean },
  asthma: { type: Boolean },
  allergy: { type: Boolean },
  relationships: { type: Map, of: String },
  otherRemarks: { type: String }
}, { _id: false });

const PastMedicalHistorySchema = new mongoose.Schema({
  hypertension: { type: Boolean },
  asthma: { type: Boolean },
  diabetesMellitus: { type: Boolean },
  cardiovascularDisease: { type: Boolean },
  allergy: { type: String },
  tuberculosis: { type: Boolean },
  surgicalOperations: { type: String },
  yellowDiscoloration: { type: Boolean },
  lastHospitalization: { type: String },
  others: { type: String }
}, { _id: false });

const TestSchema = new mongoose.Schema({
  lastTakenDate: Date,
  result: String,
  resultDate: Date
}, { _id: false });

const TestResultsSchema = new mongoose.Schema({
  cxrSputum: TestSchema,
  ecg: TestSchema,
  urinalysis: TestSchema,
  drugTesting: TestSchema,
  neuropsychiatricExam: TestSchema,
  bloodTyping: TestSchema,
  others: {
    name: String,
    ...TestSchema.obj
  }
}, { _id: false });

const SocialHistorySchema = new mongoose.Schema({
  smoking: {
    status: { type: Boolean, },
    ageStarted: { type: Number },
    sticksPerDay: { type: Number },
  },
  alcohol: {
    status: { type: Boolean, },
    frequency: { type: String }
  },
  foodPreference: { type: String }
}, { _id: false });

const ObGynHistorySchema = new mongoose.Schema({
  menarche: { type: String },
  cycle: { type: String },
  duration: { type: String },
  parity: {
    F: { type: Number, default: 0 }, // Full Term
    P: { type: Number, default: 0 }, // Pre-mature
    A: { type: Number, default: 0 }, // Abortion
    L: { type: Number, default: 0 }  // Live Birth
  },
  papsmearDone: {
    status: { type: Boolean, },
    when: { type: String }
  },
  selfBreastExamDone: { type: Boolean, },
  massNoted: {
    status: { type: Boolean, },
    location: { type: String }
  }
}, { _id: false });

const MaleExamSchema = new mongoose.Schema({
  digitalRectalExamDone: { type: Boolean, },
  examDate: { type: Date },
  result: { type: String }
}, { _id: false });

const PresentHealthStatusSchema = new mongoose.Schema({
  cough: { type: String },
  dizziness: { type: Boolean, },
  dyspnea: { type: Boolean, },
  chestBackPain: { type: Boolean, },
  easyFatigability: { type: Boolean, },
  jointExtremityPains: { type: Boolean, },
  blurringOfVision: { type: Boolean, },
  wearingEyeglasses: { type: Boolean, },
  vaginalDischargeBleeding: { type: Boolean, },
  lumps: { type: Boolean, },
  painfulUrination: { type: Boolean, },
  poorLossOfHearing: { type: Boolean, },
  syncope: { type: Boolean, },
  convulsions: { type: Boolean, },
  malaria: { type: Boolean, },
  goiter: { type: Boolean, },
  anemia: { type: Boolean, },
  dentalStatus: { type: String },
  others: { type: String },
  presentMedications: { type: String }
}, { _id: false });

const PersonnelHealthCardSchema = new mongoose.Schema({
  phcId: { type: String, unique: true, index: true, },
  personnel: { type: mongoose.Schema.Types.ObjectId, ref: "Personnel", required: true, index: true },
  interviewedBy: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    interviewDate: { type: Date, default: Date.now }
  },
  familyHistory: FamilyHistorySchema,
  pastMedicalHistory: PastMedicalHistorySchema,
  testResults: TestResultsSchema,
  socialHistory: SocialHistorySchema,
  obGynHistory: {
    type: ObGynHistorySchema,
  },
  maleExamination: {
    type: MaleExamSchema,
  },
  presentHealthStatus: PresentHealthStatusSchema,
  treatment: { type: String, default: "" },
  remarks: { type: String, default: "" },
  attachmentUrl: { type: String, default: "" },
  attachmentName: { type: String, default: "" },
  attachmentType: { type: String, default: "" },
  attachmentSize: { type: Number, default: 0 },
  attachmentMimeType: { type: String, default: "" },
  cloudinaryPublicId: { type: String, default: "" },
  isApproved: { type: Boolean, default: false, index: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },
}, {
  timestamps: true,
  collection: "personnel_health_cards",
  toJSON: { virtuals: true, versionKey: false },
  toObject: { virtuals: true }
});
PersonnelHealthCardSchema.index({ personnel: 1, "interviewedBy.interviewDate": -1 });
PersonnelHealthCardSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {

      this.phcId = generateId('PHC')
    }
    next();
  } catch (error) {
    next(error)
  }
});

PersonnelHealthCardSchema.virtual("smokingPackYears").get(function () {
  if (!this.socialHistory?.smoking?.status) return 0;
  const startYear = new Date().getFullYear() - (this.socialHistory.smoking.ageStarted || new Date().getFullYear());
  return ((this.socialHistory.smoking.sticksPerDay || 0) / 20) * startYear;
});


PersonnelHealthCardSchema.statics.findByHealthCondition = function (condition) {
  const query = {};
  query[`pastMedicalHistory.${condition}`] = true;
  return this.find(query);
};

PersonnelHealthCardSchema.statics.findByAgeRange = async function (minAge, maxAge) {
  const now = new Date();
  const minDob = new Date(now.setFullYear(now.getFullYear() - maxAge));
  const maxDob = new Date(now.setFullYear(now.getFullYear() - minAge));

  return this.find().populate({
    path: "personnel",
    match: { dob: { $gte: minDob, $lte: maxDob } }
  });
};

PersonnelHealthCardSchema.statics.findWithPersonnel = function (query = {}) {
  return this.find(query).populate("personnel", "gender dateOfBirth position");
};

PersonnelHealthCardSchema.statics.findBySymptoms = function (symptoms) {
  const normalized = symptoms.map(s => s.trim().toLowerCase());
  const query = {
    $or: normalized.map(symptom => ({
      [`presentHealthStatus.${symptom}`]: true
    }))
  };
  return this.find(query);
};

PersonnelHealthCardSchema.statics.findHighRiskPersonnel = async function () {
  return this.find({
    $or: [
      { "familyHistory.hypertension": true },
      { "familyHistory.diabetesMellitus": true },
      { "pastMedicalHistory.hypertension": true },
      { "pastMedicalHistory.diabetesMellitus": true },
      { "pastMedicalHistory.cardiovascularDisease": true }
    ]
  });
};

PersonnelHealthCardSchema.statics.findWithAbnormalTests = async function () {
  return this.find({
    $or: [
      { "testResults.cxrSputum.result": { $ne: "normal" } },
      { "testResults.ecg.result": { $ne: "normal" } },
      { "testResults.urinalysis.result": { $ne: "normal" } }
    ]
  });
};


const PersonnelHealthCardModel = mongoose.model("PersonnelHealthCard", PersonnelHealthCardSchema);
export default PersonnelHealthCardModel;