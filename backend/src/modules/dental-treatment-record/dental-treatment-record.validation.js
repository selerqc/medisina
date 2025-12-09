import Joi from 'joi';
import { objectId } from '#utils/customValidation.js';

const treatmentSchema = Joi.object({
  date: Joi.date().max('now').required().allow(null).messages({
    'date.max': 'Treatment date cannot be in the future'
  }),
  toothNo: Joi.string().trim().allow('', null),
  procedure: Joi.string().trim().required(),
  dentist: Joi.string().trim().allow('', null),
  amountCharged: Joi.number().min(0).default(0),
  amountPaid: Joi.number().min(0).default(0),
  balance: Joi.number().min(0).default(0),
  nextAppointment: Joi.date().allow(null)
});

const walkInSchema = Joi.object({
  name: Joi.string().trim().required(),
  age: Joi.number().integer().min(0).max(150).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required()
});

export const dentalTreatmentValidation = {
  createRecord: {
    body: Joi.object({
      patientType: Joi.string().valid('student', 'personnel', 'walk-in').required(),
      student: Joi.string().custom(objectId).allow(null, ''),
      personnel: Joi.string().custom(objectId).allow(null, ''),
      walkIn: walkInSchema.when('patientType', {
        is: 'walk-in',
        then: Joi.required(),
        otherwise: Joi.forbidden()
      }),
      schoolId: Joi.string().trim().allow('', null),
      treatments: Joi.array().items(treatmentSchema).default([])
    })
      .custom((value, helpers) => {
        const { patientType, student, personnel, walkIn } = value;

        if (patientType === 'student' && !student) {
          return helpers.error('any.invalid', { message: 'Student ID is required when patient type is student' });
        }
        if (patientType === 'personnel' && !personnel) {
          return helpers.error('any.invalid', { message: 'Personnel ID is required when patient type is personnel' });
        }
        if (patientType === 'walk-in' && !walkIn) {
          return helpers.error('any.invalid', { message: 'Walk-in details are required when patient type is walk-in' });
        }

        return value;
      })
  },

  updateRecord: {
    params: Joi.object({
      id: Joi.string().required()
    }),
    body: Joi.object({
      patientType: Joi.string().valid('student', 'personnel', 'walk-in'),
      student: Joi.string().custom(objectId).allow(null, ''),
      personnel: Joi.string().custom(objectId).allow(null, ''),
      walkIn: walkInSchema,
      schoolId: Joi.string().trim().allow('', null),
      treatments: Joi.array().items(treatmentSchema)
    })
  },

  addTreatment: {
    params: Joi.object({
      id: Joi.string().required()
    }),
    body: treatmentSchema
  },

  updateTreatment: {
    params: Joi.object({
      id: Joi.string().required(),
      treatmentId: Joi.string().required()
    }),
    body: Joi.object({
      date: Joi.date().max('now').messages({
        'date.max': 'Treatment date cannot be in the future'
      }),
      toothNo: Joi.string().trim().allow('', null),
      procedure: Joi.string().trim(),
      dentist: Joi.string().trim().allow('', null),
      amountCharged: Joi.number().min(0),
      amountPaid: Joi.number().min(0),
      balance: Joi.number(),
      nextAppointment: Joi.date().allow(null)
    })
  }
};
