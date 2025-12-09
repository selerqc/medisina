import Joi from 'joi';
import { gender, civilStatus, PRIORITY_LEVELS } from '#utils/constants.js';

// Simple schemas matching the form image
const respiratorySystemSchema = Joi.object({
  fluorography: Joi.string().trim().allow('').optional(),
  sputumAnalysis: Joi.string().trim().allow('').optional()
}).optional();

const circulatorySystemSchema = Joi.object({
  bloodPressure: Joi.string().trim().allow('').optional(),
  pulse: Joi.string().trim().allow('').optional(),
  sitting: Joi.string().trim().allow('').optional(),
  agilityTest: Joi.string().trim().allow('').optional()
}).optional();

const eyesSchema = Joi.object({
  conjunctivitis: Joi.string().allow('').optional(),
  colorPerception: Joi.string().allow('').optional()
}).optional();

const visionSchema = Joi.object({
  withGlasses: Joi.object({
    far: Joi.string().allow('').optional(),
    near: Joi.string().allow('').optional()
  }).optional(),
  withoutGlasses: Joi.object({
    far: Joi.string().allow('').optional(),
    near: Joi.string().allow('').optional()
  }).optional()
}).optional();

const hearingSchema = Joi.object({
  right: Joi.string().allow('').optional(),
  left: Joi.string().allow('').optional()
}).optional();

const signatureSchema = Joi.object({
  signature: Joi.string().allow('').optional(),
  name: Joi.string().trim().allow('').optional(),
  date: Joi.date().min(1900).max("now").optional()
}).optional();

const physicianSignatureSchema = Joi.object({
  signature: Joi.string().allow('').optional(),
  name: Joi.string().trim().allow('').optional(),
  licenseNumber: Joi.string().trim().allow('').optional(),
  date: Joi.date().min(1900).max("now").optional(),
  userId: Joi.string().optional()
}).optional();

const examSchema = Joi.object({
  date: Joi.date().min(1900).max("now").optional(),
  height: Joi.string().allow('').optional(),
  weight: Joi.string().allow('').optional(),
  temperature: Joi.string().allow('').optional(),
  respiratorySystem: respiratorySystemSchema,
  circulatorySystem: circulatorySystemSchema,
  digestiveSystem: Joi.string().trim().allow('').optional(),
  genitoUrinary: Joi.object({
    urinalysis: Joi.string().trim().allow('').optional()
  }).optional(),
  skin: Joi.string().trim().allow('').optional(),
  locomotorSystem: Joi.string().trim().allow('').optional(),
  nervousSystem: Joi.string().trim().allow('').optional(),
  eyes: eyesSchema,
  vision: visionSchema,
  nose: Joi.string().trim().allow('').optional(),
  ear: Joi.string().trim().allow('').optional(),
  hearing: hearingSchema,
  throat: Joi.string().trim().allow('').optional(),
  teethAndGums: Joi.string().trim().allow('').optional(),
  immunization: Joi.string().trim().allow('').optional(),
  remarks: Joi.string().trim().allow('').optional(),
  recommendation: Joi.string().trim().allow('').optional(),
  priority: Joi.string().valid(...Object.values(PRIORITY_LEVELS)).optional(),
  employee: signatureSchema,
  physician: physicianSignatureSchema
}).optional();

export const createHealthExaminationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required'
  }),
  division: Joi.string().trim().allow('').optional(),
  department: Joi.string().trim().allow('').optional(),
  dateOfBirth: Joi.date().min(1900).max("now").optional().messages({
    'date.max': 'Date of birth cannot be in the future'
  }),
  typeOfWork: Joi.string().trim().allow('').optional(),
  sex: Joi.string().valid(...gender).optional().messages({
    'any.only': `Sex must be one of: ${gender.join(', ')}`
  }),
  civilStatus: Joi.string().valid(...civilStatus).allow('').optional().messages({
    'any.only': `Civil status must be one of: ${civilStatus.join(', ')}`
  }),
  exam: examSchema
});

export const updateHealthExaminationSchema = Joi.object({
  name: Joi.string().trim().optional(),
  division: Joi.string().trim().allow('').optional(),
  department: Joi.string().trim().allow('').optional(),
  dateOfBirth: Joi.date().min(1900).max("now").optional().messages({
    'date.max': 'Date of birth cannot be in the future'
  }),
  typeOfWork: Joi.string().trim().allow('').optional(),
  sex: Joi.string().valid(...gender).optional().messages({
    'any.only': `Sex must be one of: ${gender.join(', ')}`
  }),
  civilStatus: Joi.string().valid(...civilStatus).allow('').optional().messages({
    'any.only': `Civil status must be one of: ${civilStatus.join(', ')}`
  }),
  exam: examSchema
}).min(1);

export const getHealthExaminationByIdSchema = Joi.object({
  heId: Joi.string().pattern(/^HE-\d{8}-[A-Z0-9]{6}$/)
    .required()
    .messages({
      "string.base": "Health Examination ID must be a string",
      "string.empty": "Health Examination ID cannot be empty",
      "string.pattern.base": "Health Examination ID must follow the format HE-YYYYMMDD-XXXXXX",
      "any.required": "Health Examination ID is required",
    })
})

export const bulkDeleteSchema = Joi.object({
  heIds: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one Health Examination ID is required',
    'any.required': 'Health Examination IDs array is required'
  })
});

export const searchQuerySchema = Joi.object({
  q: Joi.string().trim().required().messages({
    'string.empty': 'Search query is required',
    'any.required': 'Search query is required'
  }),
});

export const dateRangeQuerySchema = Joi.object({
  startDate: Joi.date().min('1900-01-01').max("now").required().messages({
    'any.required': 'Start date is required',
    'date.max': 'Start date cannot be in the future'
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).max("now").required().messages({
    'any.required': 'End date is required',
    'date.min': 'End date must be after start date',
    'date.max': 'End date cannot be in the future'
  }),
});

export const priorityParamSchema = Joi.object({
  priority: Joi.string().valid(...Object.values(PRIORITY_LEVELS)).required().messages({
    'any.only': `Priority must be one of: ${Object.values(PRIORITY_LEVELS).join(', ')}`,
    'any.required': 'Priority is required'
  })
});

export const divisionParamSchema = Joi.object({
  division: Joi.string().trim().required().messages({
    'string.empty': 'Division is required',
    'any.required': 'Division is required'
  })
});

export const departmentParamSchema = Joi.object({
  department: Joi.string().trim().required().messages({
    'string.empty': 'Department is required',
    'any.required': 'Department is required'
  })
});

export const approvalSchema = Joi.object({
  physicianName: Joi.string().trim().required().messages({
    'string.empty': 'Physician name is required',
    'any.required': 'Physician name is required'
  }),
  physicianSignature: Joi.string().trim().required().messages({
    'string.empty': 'Physician signature is required',
    'any.required': 'Physician signature is required'
  }),
  licenseNumber: Joi.string().trim().allow('').optional(),
  remarks: Joi.string().trim().allow('').optional(),
  recommendation: Joi.string().trim().allow('').optional()
});
