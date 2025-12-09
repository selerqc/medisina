import ApiError from '#utils/ApiError.js';
import { generateId } from '#utils/crypto.js';
import { Schema, model } from 'mongoose';

const personCountSchema = new Schema({
  male: { type: Number, default: 0, min: 0 },
  female: { type: Number, default: 0, min: 0 }
}, { _id: false });

const staffCountSchema = new Schema({
  teaching: {
    male: { type: Number, default: 0, min: 0 },
    female: { type: Number, default: 0, min: 0 }
  },
  nonTeaching: {
    male: { type: Number, default: 0, min: 0 },
    female: { type: Number, default: 0, min: 0 }
  }
}, { _id: false });

const healthAssessmentSchema = new Schema({
  assessed: {
    learners: { type: Number, default: 0, min: 0 },
    teachers: { type: Number, default: 0, min: 0 },
    ntp: { type: Number, default: 0, min: 0 }
  },
  withHealthProblems: {
    learners: { type: Number, default: 0, min: 0 },
    teachers: { type: Number, default: 0, min: 0 },
    ntp: { type: Number, default: 0, min: 0 }
  },
  visionScreening: {
    learners: { type: Number, default: 0, min: 0 }
  }
}, { _id: false });

const treatmentSchema = new Schema({
  learners: { type: Number, default: 0, min: 0 },
  teachers: { type: Number, default: 0, min: 0 },
  ntp: { type: Number, default: 0, min: 0 }
}, { _id: false });

const consultationSchema = new Schema({
  learners: { type: Number, default: 0, min: 0 },
  teachers: { type: Number, default: 0, min: 0 },
  ntp: { type: Number, default: 0, min: 0 }
}, { _id: false });

const referralSchema = new Schema({
  physician: { type: Number, default: 0, min: 0 },
  dentist: { type: Number, default: 0, min: 0 },
  guidance: { type: Number, default: 0, min: 0 },
  otherFacilities: { type: Number, default: 0, min: 0 },
  rhuDistrictProvincialHospital: { type: Number, default: 0, min: 0 }
}, { _id: false });

const orientationTrainingSchema = new Schema({
  learners: { type: Number, default: 0, min: 0 },
  teachers: { type: Number, default: 0, min: 0 },
  parents: { type: Number, default: 0, min: 0 },
  others: {
    count: { type: Number, default: 0, min: 0 },
    specify: { type: String, trim: true }
  }
}, { _id: false });

const conferenceMeetingSchema = new Schema({
  teachersAdministrators: { type: Number, default: 0, min: 0 },
  healthOfficials: { type: Number, default: 0, min: 0 },
  learners: { type: Number, default: 0, min: 0 },
  parents: { type: Number, default: 0, min: 0 },
  lguBarangay: { type: Number, default: 0, min: 0 },
  ngoStakeholders: { type: Number, default: 0, min: 0 }
}, { _id: false });

const resourcePersonSchema = new Schema({
  healthActivitiesPrograms: { type: Number, default: 0, min: 0 },
  classDiscussion: { type: Number, default: 0, min: 0 },
  healthClubsOrganization: { type: Number, default: 0, min: 0 }
}, { _id: false });

const skinScalpSchema = new Schema({
  pediculosis: { type: Number, default: 0, min: 0 },
  rednessOfSkin: { type: Number, default: 0, min: 0 },
  whiteSpots: { type: Number, default: 0, min: 0 },
  flakySkin: { type: Number, default: 0, min: 0 },
  minorInjuries: { type: Number, default: 0, min: 0 },
  impetigoBoil: { type: Number, default: 0, min: 0 },
  skinLesions: { type: Number, default: 0, min: 0 },
  acnePimples: { type: Number, default: 0, min: 0 },
  itchiness: { type: Number, default: 0, min: 0 }
}, { _id: false });

const eyeEarSchema = new Schema({
  mattedEyelashes: { type: Number, default: 0, min: 0 },
  eyeRedness: { type: Number, default: 0, min: 0 },
  ocularMisalignment: { type: Number, default: 0, min: 0 },
  eyeDischarge: { type: Number, default: 0, min: 0 },
  paleConjunctiva: { type: Number, default: 0, min: 0 },
  hordeolum: { type: Number, default: 0, min: 0 },
  earDischarge: { type: Number, default: 0, min: 0 },
  mucusDischarge: { type: Number, default: 0, min: 0 },
  noseBleeding: { type: Number, default: 0, min: 0 }
}, { _id: false });

const mouthNeckThroatSchema = new Schema({
  presenceOfLesions: { type: Number, default: 0, min: 0 },
  inflamedPharynx: { type: Number, default: 0, min: 0 },
  enlargedTonsils: { type: Number, default: 0, min: 0 },
  enlargedLymphnodes: { type: Number, default: 0, min: 0 }
}, { _id: false });

const heartLungsSchema = new Schema({
  rates: { type: Number, default: 0, min: 0 },
  murmur: { type: Number, default: 0, min: 0 },
  irregularHeartRate: { type: Number, default: 0, min: 0 },
  wheezes: { type: Number, default: 0, min: 0 }
}, { _id: false });

const deformitiesSchema = new Schema({
  acquired: {
    count: { type: Number, default: 0, min: 0 },
    specify: { type: String, trim: true }
  },
  congenital: {
    count: { type: Number, default: 0, min: 0 },
    specify: { type: String, trim: true }
  }
}, { _id: false });

const nutritionalStatusSchema = new Schema({
  normal: { type: Number, default: 0, min: 0 },
  wasted: { type: Number, default: 0, min: 0 },
  severelyWasted: { type: Number, default: 0, min: 0 },
  obese: { type: Number, default: 0, min: 0 },
  overweight: { type: Number, default: 0, min: 0 },
  stunted: { type: Number, default: 0, min: 0 },
  tall: { type: Number, default: 0, min: 0 }
}, { _id: false });

const abdomenSchema = new Schema({
  abdominalPain: { type: Number, default: 0, min: 0 },
  distended: { type: Number, default: 0, min: 0 },
  tenderness: { type: Number, default: 0, min: 0 },
  dysmenorrhea: { type: Number, default: 0, min: 0 }
}, { _id: false });

const dentalServiceSchema = new Schema({
  gingivitis: { type: Number, default: 0, min: 0 },
  periodontalDisease: { type: Number, default: 0, min: 0 },
  malocclusion: { type: Number, default: 0, min: 0 },
  supernumeraryTeeth: { type: Number, default: 0, min: 0 },
  retainedDecidousTeeth: { type: Number, default: 0, min: 0 },
  decubitalUlcer: { type: Number, default: 0, min: 0 },
  calculus: { type: Number, default: 0, min: 0 },
  cleftLipPalate: { type: Number, default: 0, min: 0 },
  fluorosis: { type: Number, default: 0, min: 0 },
  others: {
    count: { type: Number, default: 0, min: 0 },
    specify: { type: String, trim: true }
  },
  totalDMFT: { type: Number, default: 0, min: 0 },
  totalDmft: { type: Number, default: 0, min: 0 }
}, { _id: false });

const signatureBuildersSchema = new Schema({
  preparedBy: {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    signatureString:{type:String}
  },
  notedBy: {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    signatureString: { type: String }
  }
}, { _id: false });

const annualAccomplishmentReportSchema = new Schema({
  aarId: { type: String },
  region: { type: String, trim: true },
  division: { type: String, required: true, trim: true },
  schoolYear: { type: String, required: true, trim: true },
  schoolName: { type: String, required: true, trim: true },
  schoolIdNo: { type: String, required: true, trim: true },
  totalElemSchoolsVisited: { type: Number, default: 0, min: 0 },
  totalSecSchoolsVisited: { type: Number, default: 0, min: 0 },

  generalInformation: {
    schoolEnrollment: personCountSchema,
    schoolPersonnel: staffCountSchema
  },

  healthServices: {
    healthAppraisal: healthAssessmentSchema,
    treatmentDone: treatmentSchema,
    pupilsDewormed: {
      firstRound: { type: Number, default: 0, min: 0 },
      secondRound: { type: Number, default: 0, min: 0 }
    },
    pupilsGivenIronSupplement: { type: Number, default: 0, min: 0 },
    pupilsImmunized: {
      count: { type: Number, default: 0, min: 0 },
      vaccineSpecified: { type: String, trim: true }
    },
    consultationAttended: consultationSchema,
    referral: referralSchema
  },

  healthEducation: {
    classesGivenHealthLectures: { type: Number, default: 0, min: 0 },
    orientationTraining: orientationTrainingSchema,
    conferenceMeeting: conferenceMeetingSchema,
    involvementAsResourcePerson: resourcePersonSchema
  },

  schoolCommunityActivities: {
    ptaHomeroomMeetings: { type: Number, default: 0, min: 0 },
    parentEducationSeminar: { type: Number, default: 0, min: 0 },
    homeVisitsConducted: { type: Number, default: 0, min: 0 },
    hospitalVisitsMade: { type: Number, default: 0, min: 0 }
  },

  commonSignsSymptoms: {
    skinAndScalp: skinScalpSchema,
    eyeAndEars: eyeEarSchema,
    mouthNeckThroat: mouthNeckThroatSchema,
    heartAndLungs: heartLungsSchema,
    deformities: deformitiesSchema,
    nutritionalStatus: nutritionalStatusSchema,
    abdomen: abdomenSchema,
    dentalService: dentalServiceSchema,
    otherSignsSymptoms: [{
      type: String,
      trim: true
    }]
  },

  remarks: { type: String, trim: true },

  signatures: signatureBuildersSchema,

  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },

}, {
  timestamps: true,
  collection: 'annual_accomplishment_reports'
});

annualAccomplishmentReportSchema.index({ schoolYear: 1, schoolIdNo: 1 });
annualAccomplishmentReportSchema.index({  division: 1 });
annualAccomplishmentReportSchema.index({ createdAt: -1 });
annualAccomplishmentReportSchema.index({ acrdId: 1 })
annualAccomplishmentReportSchema.virtual('totalEnrollment').get(function () {
  return (this.generalInformation?.schoolEnrollment?.male || 0) +
    (this.generalInformation?.schoolEnrollment?.female || 0);
});

annualAccomplishmentReportSchema.virtual('totalPersonnel').get(function () {
  const teaching = (this.generalInformation?.schoolPersonnel?.teaching?.male || 0) +
    (this.generalInformation?.schoolPersonnel?.teaching?.female || 0);
  const nonTeaching = (this.generalInformation?.schoolPersonnel?.nonTeaching?.male || 0) +
    (this.generalInformation?.schoolPersonnel?.nonTeaching?.female || 0);
  return teaching + nonTeaching;
});

annualAccomplishmentReportSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.aarId = generateId("AAR")
    const existingReport = await this.constructor.findOne({
      schoolYear: this.schoolYear,
      schoolIdNo: this.schoolIdNo,
      isActive: true,

      _id: { $ne: this._id }
    });

    if (existingReport) {
      const error = new ApiError('Annual accomplishment report already exists for this school and academic year', 400);
      return next(error);
    }
  }
  next();
});

annualAccomplishmentReportSchema.methods.calculateTotalAssessed = function () {
  const healthAppraisal = this.healthServices?.healthAppraisal?.assessed;
  return (healthAppraisal?.learners || 0) +
    (healthAppraisal?.teachers || 0) +
    (healthAppraisal?.ntp || 0);
};

annualAccomplishmentReportSchema.methods.calculateTotalWithHealthProblems = function () {
  const healthProblems = this.healthServices?.healthAppraisal?.withHealthProblems;
  return (healthProblems?.learners || 0) +
    (healthProblems?.teachers || 0) +
    (healthProblems?.ntp || 0);
};

annualAccomplishmentReportSchema.statics.findBySchoolYear = function (schoolYear) {
  return this.find({ schoolYear, isActive: true }).sort({ createdAt: -1 });
};

annualAccomplishmentReportSchema.statics.findByRegionDivision = function (region, division) {
  return this.find({ region, division, isActive: true }).sort({ schoolName: 1 });
};

annualAccomplishmentReportSchema.set('toJSON', { virtuals: true });
annualAccomplishmentReportSchema.set('toObject', { virtuals: true });

const AnnualAccomplishmentReport = model('AnnualAccomplishmentReport', annualAccomplishmentReportSchema);

export default AnnualAccomplishmentReport;