import express from 'express';
import { auth } from '#middleware/auth.js';
import validate from '#middleware/validateRequests.js';
import upload, { handleMulterError } from '#middleware/upload.js';
import * as prescriptionController from './prescription.controller.js';
import {
  createPrescriptionSchema,
  updatePrescriptionSchema,
  prescriptionIdParamSchema,
  prescriptionFiltersSchema
} from './prescription.validation.js';

const router = express.Router();

router
  .route('/')
  .post(auth('Doctor', 'Nurse', 'Admin'), validate({ body: createPrescriptionSchema }), prescriptionController.createPrescription)
  .get(auth('Doctor', 'Nurse', 'Admin'), validate({ query: prescriptionFiltersSchema }), prescriptionController.getAllPrescriptions);

router
  .route('/stats')
  .get(auth('Doctor', 'Nurse', 'Admin'), prescriptionController.getPrescriptionStats);

router
  .route('/medication-recommendations')
  .get(auth('Doctor', 'Nurse', 'Admin'), prescriptionController.getMedicationRecommendations);

router
  .route('/validate-medications')
  .post(auth('Doctor', 'Nurse', 'Admin'), prescriptionController.validatePrescriptionMedications);

router
  .route('/generate-from-health-alert/:studentId')
  .get(auth('Doctor', 'Nurse', 'Admin'), prescriptionController.generatePrescriptionFromHealthAlert);

router
  .route('/generate-from-personnel-health/:personnelId')
  .get(auth('Doctor', 'Nurse', 'Admin'), prescriptionController.generatePrescriptionFromPersonnelHealth);
router.get('/prescriptions-by-user', auth('Nurse'), prescriptionController.getAllPrescriptionsByUser)

router
  .route('/:prescriptionId')
  .get(auth('Doctor', 'Nurse', 'Admin'), validate({ params: prescriptionIdParamSchema }), prescriptionController.getPrescriptionById)
  .patch(auth('Doctor', 'Nurse', 'Admin'), validate({ params: prescriptionIdParamSchema, body: updatePrescriptionSchema }), prescriptionController.updatePrescription)
  .delete(auth('Doctor', 'Admin'), validate({ params: prescriptionIdParamSchema }), prescriptionController.deletePrescription);



router.get('/:prescriptionId/export-pdf', validate({ params: prescriptionIdParamSchema }), prescriptionController.exportPrescriptionPdf)

export default router;
