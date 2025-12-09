import express from 'express';
import * as annualAccomplishmentReportController from './annual-accomplishment-report.controller.js';
import { auth } from "#middleware/auth.js";
import { personnelRoles } from '#utils/constants.js';
import validate from '#middleware/validateRequests.js';
import Joi from 'joi';
import {
  createReport,
  updateReport,
  reportIdParam,
  schoolIdNoParam,
  schoolYearParam,
  getReportBySchoolAndYear,
  getReportsBySchoolYear,
  getReportsByRegionDivision,
  autoGenerateReport
} from './annual-accomplishment-report.validation.js';

const router = express.Router();

const reportIdValidation = Joi.object({ reportId: reportIdParam });

router.route('/')
  .get(auth(...personnelRoles), annualAccomplishmentReportController.getAllReports)
  .post(auth(...personnelRoles), validate({ body: createReport }), annualAccomplishmentReportController.createReport);

router.get('/search', auth(...personnelRoles), annualAccomplishmentReportController.searchReports);
router.get('/statistics', auth(...personnelRoles), annualAccomplishmentReportController.getReportsStatistics);
router.get('/statistics/health-profile/:schoolId/:schoolYear', auth(...personnelRoles), annualAccomplishmentReportController.getHealthProfileStatistics);
router.get('/analytics', auth(...personnelRoles), annualAccomplishmentReportController.getHealthServicesAnalytics);
router.get('/dashboard', auth(...personnelRoles), annualAccomplishmentReportController.getDashboardSummary);

router.get('/by-school', auth(...personnelRoles), annualAccomplishmentReportController.getReportsBySchoolName);



router.get('/school-year/:schoolYear', auth(...personnelRoles), validate({ params: getReportsBySchoolYear }), annualAccomplishmentReportController.getReportsBySchoolYear);

router.get('/region/:region/division/:division', auth(...personnelRoles), validate({ params: getReportsByRegionDivision }), annualAccomplishmentReportController.getReportsByRegionDivision);

router.get('/school/:schoolIdNo/year/:schoolYear', auth(...personnelRoles), validate({ params: getReportBySchoolAndYear }), annualAccomplishmentReportController.getReportBySchoolAndYear);

router.route('/:reportId')
  .get(auth(...personnelRoles), validate({ params: reportIdValidation }), annualAccomplishmentReportController.getReportById)
  .put(auth(...personnelRoles), validate({ params: reportIdValidation, body: updateReport }), annualAccomplishmentReportController.updateReport)
  .delete(auth('Admin'), validate({ params: reportIdValidation }), annualAccomplishmentReportController.deleteReport)


router.route('/:reportId/download')
  .get(auth(...personnelRoles), validate({ params: reportIdValidation }), annualAccomplishmentReportController.exportRecords);

export default router;
