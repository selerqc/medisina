import express from 'express';
import { auth } from '../../middleware/auth.js';
import validate from '../../middleware/validateRequests.js';
import * as schoolHealthSurveyValidation from './school-health-survey.validation.js';
import * as schoolHealthSurveyController from './school-health-survey.controller.js';
import { personnelRoles } from '#utils/constants.js';

const router = express.Router();

router.use(auth(...personnelRoles))
router
  .route('/')
  .post(validate(schoolHealthSurveyValidation.createSchoolHealthSurvey), schoolHealthSurveyController.createSchoolHealthSurvey)
  .get(validate(schoolHealthSurveyValidation.getSchoolHealthSurveys), schoolHealthSurveyController.getSchoolHealthSurveys);

router
  .route('/enrollment/statistics')
  .get(validate(schoolHealthSurveyValidation.getEnrollmentStatistics), schoolHealthSurveyController.getEnrollmentStatistics);

router
  .route('/personnel/statistics')
  .get(validate(schoolHealthSurveyValidation.getPersonnelStatistics), schoolHealthSurveyController.getPersonnelStatistics);

router
  .route('/examined-assessed/statistics')
  .get(validate(schoolHealthSurveyValidation.getExaminedAssessedStatistics), schoolHealthSurveyController.getExaminedAssessedStatistics);

router
  .route('/common-signs-symptoms/statistics')
  .get(validate(schoolHealthSurveyValidation.getCommonSignsSymptoms), schoolHealthSurveyController.getCommonSignsSymptoms);

router
  .route('/health-profile/statistics')
  .get(validate(schoolHealthSurveyValidation.getHealthProfileStatistics), schoolHealthSurveyController.getHealthProfileStatistics);

router
  .route('/consolidated/division-grade-month')
  .get(validate(schoolHealthSurveyValidation.getConsolidatedStatistics), schoolHealthSurveyController.getConsolidatedStatisticsByDivisionGradeMonth);

router
  .route('/consolidated/division-grade-month/export')
  .get(validate(schoolHealthSurveyValidation.getConsolidatedStatistics), schoolHealthSurveyController.exportConsolidatedReportToExcel);

router
  .route('/pending')
  .get(schoolHealthSurveyController.getPendingSurveys);

router
  .route('/export')
  .get(validate(schoolHealthSurveyValidation.exportSurveyData), schoolHealthSurveyController.exportSurveyData);

router
  .route('/bulk/update-status')
  .patch(validate(schoolHealthSurveyValidation.bulkUpdateStatus), schoolHealthSurveyController.bulkUpdateStatus);

router
  .route('/year/:year')
  .get(validate(schoolHealthSurveyValidation.getSchoolHealthSurveysByYear), schoolHealthSurveyController.getSchoolHealthSurveysByYear);

router
  .route('/region/:region/division/:division')
  .get(validate(schoolHealthSurveyValidation.getSchoolHealthSurveysByRegionDivision), schoolHealthSurveyController.getSchoolHealthSurveysByRegionDivision);

router
  .route('/statistics/region/:region/:year')
  .get(validate(schoolHealthSurveyValidation.getRegionalStatistics), schoolHealthSurveyController.getRegionalStatistics);

router
  .route('/:schoolHealthSurveyId')
  .get(validate(schoolHealthSurveyValidation.schoolHealthSurveyId), schoolHealthSurveyController.getSchoolHealthSurvey)
  .patch(validate(schoolHealthSurveyValidation.updateSchoolHealthSurvey), schoolHealthSurveyController.updateSchoolHealthSurvey)
  .delete(validate(schoolHealthSurveyValidation.schoolHealthSurveyId), schoolHealthSurveyController.deleteSchoolHealthSurvey);

router
  .route('/:schoolHealthSurveyId/complete')
  .patch(validate(schoolHealthSurveyValidation.schoolHealthSurveyId), schoolHealthSurveyController.markSurveyAsCompleted);

router
  .route('/:schoolHealthSurveyId/submit')
  .patch(validate(schoolHealthSurveyValidation.markSurveyStatus), schoolHealthSurveyController.markSurveyAsSubmitted);

router
  .route('/:schoolHealthSurveyId/approve')
  .patch(validate(schoolHealthSurveyValidation.approveSurvey), schoolHealthSurveyController.approveSurvey);

router
  .route('/:schoolHealthSurveyId/reject')
  .patch(validate(schoolHealthSurveyValidation.rejectSurvey), schoolHealthSurveyController.rejectSurvey);

router
  .route('/status/submitted')
  .get(schoolHealthSurveyController.getSubmittedSurveys);

router
  .route('/status/approved')
  .get(schoolHealthSurveyController.getApprovedSurveys);

router
  .route('/status/rejected')
  .get(schoolHealthSurveyController.getRejectedSurveys);

router
  .route('/:schoolHealthSurveyId/statistics')
  .get(validate(schoolHealthSurveyValidation.getSchoolHealthSurvey), schoolHealthSurveyController.getSurveyStatistics);

router
  .route('/:schoolHealthSurveyId/duplicate')
  .post(validate(schoolHealthSurveyValidation.duplicateSurvey), schoolHealthSurveyController.duplicateSurvey);

router
  .route('/:schoolHealthSurveyId/auto-populate')
  .post(validate(schoolHealthSurveyValidation.schoolHealthSurveyId), schoolHealthSurveyController.autoPopulateData);

export default router;
