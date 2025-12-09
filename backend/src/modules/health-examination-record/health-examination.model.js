import ApiError from "#utils/ApiError.js";
import { gender, civilStatus, PRIORITY_LEVELS } from "#utils/constants.js";
import { generateId } from "#utils/crypto.js";
import mongoose from "mongoose";


const HealthExaminationRecordSchema = new mongoose.Schema(
  {
    heId: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    division: { type: String },
    department: { type: String },
    dateOfBirth: { type: Date },
    typeOfWork: { type: String },
    sex: { type: String, enum: gender },
    civilStatus: { type: String },
    exam: {
      date: { type: Date },
      height: { type: String },
      weight: { type: String },
      temperature: { type: String },

      respiratorySystem: {
        fluorography: { type: String },
        sputumAnalysis: { type: String }
      },

      circulatorySystem: {
        bloodPressure: { type: String },
        pulse: { type: String },
        sitting: { type: String },
        agilityTest: { type: String }
      },

      digestiveSystem: { type: String },

      genitoUrinary: {
        urinalysis: { type: String }
      },

      skin: { type: String },
      locomotorSystem: { type: String },
      nervousSystem: { type: String },

      eyes: {
        conjunctivitis: { type: String },
        colorPerception: { type: String }
      },

      vision: {
        withGlasses: {
          far: { type: String },
          near: { type: String }
        },
        withoutGlasses: {
          far: { type: String },
          near: { type: String }
        }
      },

      nose: { type: String },
      ear: { type: String },

      hearing: {
        right: { type: String },
        left: { type: String }
      },

      throat: { type: String },
      teethAndGums: { type: String },
      immunization: { type: String },

      remarks: {
        type: String,
        trim: true
      },
      recommendation: {
        type: String,
        trim: true
      },
      priority: {
        type: String,
        enum: Object.values(PRIORITY_LEVELS),
        default: PRIORITY_LEVELS.LOW
      },
      status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Reviewed'],
        default: 'Pending'
      },

      employee: {
        signature: { type: String },
        name: { type: String, trim: true },
        date: { type: Date }
      },

      physician: {
        signature: { type: String },
        name: { type: String, trim: true },
        licenseNumber: { type: String, trim: true },
        date: { type: Date },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    },

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
  },
  {
    timestamps: true,
    collection: 'health_examination_records',
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true }
  }
);


HealthExaminationRecordSchema.index({ name: 1, 'exam.date': -1 });
HealthExaminationRecordSchema.index({ 'exam.date': -1 });
HealthExaminationRecordSchema.index({ division: 1, department: 1 });
HealthExaminationRecordSchema.index({ 'exam.status': 1, 'exam.date': -1 });
HealthExaminationRecordSchema.index({ createdAt: -1 });


HealthExaminationRecordSchema.pre('save', function (next) {
  if (!this.name) {
    return next(new ApiError('Name is required for a health record', 400));
  }
  if (this.isNew) {
    this.heId = generateId('HE')
  }
  next();
});

HealthExaminationRecordSchema.statics.findByPersonnel = function (heId) {
  return this.find({ heId, isDeleted: false })
    .sort({ 'exam.date': -1 })
    .populate('personnelId', 'firstName lastName fullName')
    .populate('createdBy', 'firstName lastName')
    .lean();
};


HealthExaminationRecordSchema.methods.softDelete = async function (userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  await this.save();
  return this;
};

HealthExaminationRecordSchema.methods.restore = async function () {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  await this.save();
  return this;
};

HealthExaminationRecordSchema.methods.markAsCompleted = async function (userId) {
  if (!this.exam) {
    throw new ApiError('Examination data is missing', 400);
  }
  this.exam.status = 'Completed';
  this.updatedBy = userId;
  await this.save();
  return this;
};

HealthExaminationRecordSchema.methods.toSafeJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    division: this.division,
    department: this.department,
    dateOfBirth: this.dateOfBirth,
    age: this.age,
    sex: this.sex,
    civilStatus: this.civilStatus,
    bloodType: this.bloodType,
    bmi: this.bmi,
    bmiCategory: this.bmiCategory,
    overallHealthStatus: this.overallHealthStatus,
    exam: this.exam,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    version: this.version
  };
};

export default mongoose.model('HealthExaminationRecord', HealthExaminationRecordSchema);
