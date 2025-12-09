import Joi from 'joi';
import { gender } from '#utils/constants.js';

const referralSlipSchema = Joi.object({
  to: Joi.string().trim().required().messages({
    'string.empty': 'Recipient is required',
    'any.required': 'Recipient is required'
  }),
  date: Joi.date().max('now').required().messages({
    'any.required': 'Date is required',
    'date.max': 'Date cannot be in the future'
  }),
  agency: Joi.string().trim().allow('').optional(),
  address: Joi.string().trim().allow('').optional(),
  name: Joi.string().trim().required().messages({
    'string.empty': 'Patient name is required',
    'any.required': 'Patient name is required'
  }),
  age: Joi.number().min(0).max(150).optional(),
  sex: Joi.string().valid(...gender).optional().messages({
    'any.only': `Sex must be one of: ${gender.join(', ')}`
  }),
  addressOrSchool: Joi.string().trim().allow('').optional(),
  grade: Joi.string().trim().allow('').optional(),
  chiefComplaint: Joi.string().trim().allow('').optional(),
  impression: Joi.string().trim().allow('').optional(),
  remarks: Joi.string().trim().allow('').optional(),
  referrerName: Joi.string().trim().allow('').optional(),
  referrerDesignation: Joi.string().trim().allow('').optional(),
  signatureString: Joi.string().allow('').optional(),
}).optional();

const returnSlipSchema = Joi.object({
  returnedTo: Joi.string().trim().allow('').optional(),
  nameOfPatient: Joi.string().trim().allow('').optional(),
  dateReferred: Joi.date().max('now').optional().messages({
    'date.max': 'Date referred cannot be in the future'
  }),
  chiefComplaint: Joi.string().trim().allow('').optional(),
  findings: Joi.string().trim().allow('').optional(),
  actionOrRecommendations: Joi.string().trim().allow('').optional(),
  date: Joi.date().max('now').optional().messages({
    'date.max': 'Date cannot be in the future'
  }),
  signatureName: Joi.string().trim().allow('').optional(),
  designation: Joi.string().trim().allow('').optional()
}).optional();

export const createReferralSlipSchema = Joi.object({

  referralSlip: referralSlipSchema.required().messages({
    'any.required': 'Referral slip information is required'
  }),
  returnSlip: returnSlipSchema
});

export const updateReferralSlipSchema = Joi.object({

  referralSlip: referralSlipSchema,
  returnSlip: returnSlipSchema
}).min(1);

export const updateReturnSlipSchema = Joi.object({
  returnedTo: Joi.string().trim().allow('').optional(),
  nameOfPatient: Joi.string().trim().allow('').optional(),
  dateReferred: Joi.date().max('now').optional().messages({
    'date.max': 'Date referred cannot be in the future'
  }),
  chiefComplaint: Joi.string().trim().allow('').optional(),
  findings: Joi.string().trim().allow('').optional(),
  actionOrRecommendations: Joi.string().trim().allow('').optional(),
  date: Joi.date().max('now').optional().messages({
    'date.max': 'Date cannot be in the future'
  }),
  signatureName: Joi.string().trim().allow('').optional(),
  designation: Joi.string().trim().allow('').optional()
}).min(1);

export const getReferralSlipByIdSchema = Joi.object({
  rsId: Joi.string().pattern(/^RS-\d{8}-[A-Z0-9]{6}$/)
    .required()
    .messages({
      "string.base": "Referall ID must be a string",
      "string.empty": "Referall ID cannot be empty",
      "string.pattern.base": "Referall ID must follow the format RS-YYYYMMDD-XXXXXX",
      "any.required": "Referall ID is required",
    })
})

export const bulkDeleteSchema = Joi.object({
  rsIds: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one Referral Slip ID is required',
    'any.required': 'Referral Slip IDs array is required'
  })
});

export const searchQuerySchema = Joi.object({
  q: Joi.string().trim().required().messages({
    'string.empty': 'Search query is required',
    'any.required': 'Search query is required'
  })
});

export const dateRangeQuerySchema = Joi.object({
  startDate: Joi.date().max('now').required().messages({
    'any.required': 'Start date is required',
    'date.max': 'Start date cannot be in the future'
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).max('now').required().messages({
    'any.required': 'End date is required',
    'date.min': 'End date must be after start date',
    'date.max': 'End date cannot be in the future'
  })
});

export const referrerNameParamSchema = Joi.object({
  referrerName: Joi.string().trim().required().messages({
    'string.empty': 'Referrer name is required',
    'any.required': 'Referrer name is required'
  })
});
