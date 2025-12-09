import express from 'express';
import * as personnelHealthCardController from './personnel-health-card.controller.js';
import validate from '#middleware/validateRequests.js';
import {
  healthCardSchema,
  phcIdSchema,
  ageRangeSchema,
  symptomsSchema,
  conditionParamSchema,
  dayRangeSchema,
  genderSchema,
} from './personnel-health-card.validation.js';
import { auth } from "#middleware/auth.js";
import { personnelRoles } from '#utils/constants.js';

const router = express.Router();

router.use(auth(...personnelRoles));

router.get('/', personnelHealthCardController.getAllHealthCards);
router.get('/count', personnelHealthCardController.getHealthCardCount);

router.get('/search', personnelHealthCardController.searchPersonnelWithHealthCard);

router.post('/', validate({ body: healthCardSchema }), personnelHealthCardController.createHealthCard);
router.get('/personnel/dss-dashboard', personnelHealthCardController.getHealthCardDSSDashboard);
router.get('/personnel/dss-dashboard/export', personnelHealthCardController.exportRiskStratificationToExcel);
router.get('/personnel-by-category/:category', personnelHealthCardController.getPersonnelByCategory);

router.get('/age-range', validate({ query: ageRangeSchema }), personnelHealthCardController.getHealthCardsByAgeRange);

router.get('/condition/:condition', validate({ params: conditionParamSchema }), personnelHealthCardController.getHealthCardsByCondition);

router.get('/symptoms', validate({ query: symptomsSchema }), personnelHealthCardController.getHealthCardsBySymptoms);

router.get('/gender', validate({ query: genderSchema }), personnelHealthCardController.getHealthCardsByGender);

router.get('/recent', validate({ params: dayRangeSchema }), personnelHealthCardController.getRecentHealthCards);

router.get('/summary', personnelHealthCardController.getHealthSummaryReport);

router.post('/:phcId/generate-prescription', personnelHealthCardController.generatePrescriptionFromRecord);

router.get('/:phcId/export', validate({ params: phcIdSchema }), personnelHealthCardController.exportPersonnelHealthCard);

router
  .route('/:phcId')
  .get(validate({ params: phcIdSchema }), personnelHealthCardController.getHealthCardById)
  .patch(
    validate({ params: phcIdSchema, body: healthCardSchema }),
    personnelHealthCardController.updateHealthCardById
  )
  .delete(validate({ params: phcIdSchema }), personnelHealthCardController.deleteHealthCardById);

router.get('/personnel/:phcId', validate({ params: phcIdSchema }), personnelHealthCardController.getHealthCardsByPersonnel);

router.get('/personnel/:phcId/dss', validate({ params: phcIdSchema }), personnelHealthCardController.getHealthCardDSSByPersonnel);


export default router;
