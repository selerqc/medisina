import BaseJoi from "joi";
import JoiDate from "@joi/date";
import mongoose from "mongoose";
import { clinicalCategories, gradeKeys, healthAlerts } from "#utils/constants.js";

const Joi = BaseJoi.extend(JoiDate);

const stdIdString = Joi.string()
  .pattern(/^STD-\d{8}-[A-Z0-9]{6}$/)
  .required()
  .messages({
    "string.base": "Student ID must be a string",
    "string.empty": "Student ID cannot be empty",
    "string.pattern.base": "Student ID must follow the format STD-YYYYMMDD-XXXXXX",
    "any.required": "Student ID is required",
  });

const stdIdParam = Joi.object({
  stdId: stdIdString
});
const objectId = () =>
  Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId Validation")
    .messages({
      "any.invalid": "Invalid ObjectId format"
    });

const gradeSchema = Joi.string()
  .valid(...gradeKeys)
  .required()
  .messages({
    "any.only": "Invalid grade level",
    "any.required": "Grade is required"
  });

// Health alert validation schema
const healthAlertSchema = Joi.object({
  type: Joi.string().valid(...healthAlerts).required(),
  severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE').required(),
  description: Joi.string().required(),
  recommendedAction: Joi.string().required(),
  requiresImmediateAttention: Joi.boolean().default(false)
});

// Clinical recommendation validation schema  
const clinicalRecommendationSchema = Joi.object({
  category: Joi.string().valid(...clinicalCategories).required(),
  description: Joi.string().required(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').required(),
  targetDate: Joi.date().optional(),
  assignedTo: Joi.string().valid('NURSE', 'DOCTOR', 'TEACHER').required()
});

// Flagged condition validation schema
const flaggedConditionSchema = Joi.object({
  condition: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().required(),
  requiresMonitoring: Joi.boolean().default(false),
  lastUpdated: Joi.date().default(() => new Date())
});

const examinationFindingsSchema = Joi.object({
  dateOfExamination: Joi.date()
    .format("YYYY-MM-DD")
    .utc()
    .less("now")
    .required()
    .messages({
      "date.less": "Examination date cannot be in the future",
      "any.required": "Date of examination is required"
    }),
  temperatureBP: Joi.string().trim().max(100).optional().allow(""),
  heartRatePulseRateRespiratoryRate: Joi.string().trim().max(100).optional().allow(""),
  heightInCm: Joi.number().min(0).max(250).precision(1).optional().default(0),
  weightInKg: Joi.number().min(0).max(300).precision(1).optional().default(0),
  nutritionalStatusBMI: Joi.string().optional().allow(""),
  nutritionalStatusHeightForAge: Joi.string().optional().allow(""),
  visionScreening: Joi.string().optional().allow(""),
  auditoryScreening: Joi.string().optional().allow(""),
  skinScalp: Joi.string().optional().allow(""),
  eyesEarsNose: Joi.string().optional().allow(""),
  mouthThroatNeck: Joi.string().optional().allow(""),
  lungsHeart: Joi.string().optional().allow(""),
  abdomen: Joi.string().optional().allow(""),
  deformities: Joi.string().optional().allow(""),
  deformitiesSpecify: Joi.string().trim().max(200).optional().allow(""),
  ironSupplementation: Joi.boolean().optional(),
  deworming: Joi.object({
    firstRound: Joi.boolean().optional().allow(""),
    firstRoundDate: Joi.date().optional().allow(""),
    secondRound: Joi.boolean().optional().allow(""),
    secondRoundDate: Joi.date().optional().allow("")
  }).optional(),
  immunization: Joi.string().trim().max(200).optional().allow(""),
  sbfpBeneficiary: Joi.boolean().optional(),
  fourPsBeneficiary: Joi.boolean().optional(),
  menarche: Joi.boolean().optional(),
  othersSpecify: Joi.string().trim().max(500).optional().allow(""),

  // DSS Decision Support Fields
  overallHealthStatus: Joi.string().valid('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL').default('GOOD').optional(),
  riskLevel: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').default('LOW').optional(),
  healthAlerts: Joi.array().items(healthAlertSchema).optional().default([]),
  clinicalRecommendations: Joi.array().items(clinicalRecommendationSchema).optional().default([]),
  flaggedConditions: Joi.array().items(flaggedConditionSchema).optional().default([])
});

// Single examination entry validation schema
const examinationSchema = Joi.object({
  grade: gradeSchema,
  findings: examinationFindingsSchema.required(),
  examiner: objectId().optional(),
  approvedBy: objectId().optional(),
  isApproved: Joi.boolean().default(false).optional(),
  approvedAt: Joi.date().optional(),
  remarks: Joi.string().trim().max(500).optional().allow(""),
  complaint: Joi.string().trim().max(500).optional().allow(""),
});

const createSchoolHealthExamCard = Joi.object({
  stdId: stdIdString,
  examinations: Joi.array().items(examinationSchema).min(1).required().messages({
    "array.min": "At least one examination is required",
    "any.required": "Examinations array is required"
  }),
  lastModifiedBy: objectId().optional()
});

const updateSchoolHealthExamCard = Joi.object({
  examinations: Joi.array().items(examinationSchema).optional(),
  lastModifiedBy: objectId().optional()
}).min(1);

// Add examination to existing card
const addExaminationSchema = Joi.object({
  grade: gradeSchema,
  findings: examinationFindingsSchema.required(),
  examiner: objectId().optional(),
  remarks: Joi.string().trim().max(500).optional().allow("")
});

// Update specific examination
const updateExaminationSchema = Joi.object({
  findings: examinationFindingsSchema.optional(),
  examiner: objectId().optional(),
  remarks: Joi.string().trim().max(500).optional().allow("")
}).min(1);


const stdIdGradeParam = Joi.object({
  stdId: stdIdString,
  grade: gradeSchema,
});

const approveExamination = Joi.object({
  remarks: Joi.string().trim().max(500).optional().allow("").messages({
    "string.max": "Remarks cannot exceed 500 characters"
  }),
});

export {
  createSchoolHealthExamCard,
  updateSchoolHealthExamCard,
  addExaminationSchema,
  updateExaminationSchema,
  stdIdParam,
  stdIdGradeParam,
  approveExamination,
  examinationSchema,
  examinationFindingsSchema
};