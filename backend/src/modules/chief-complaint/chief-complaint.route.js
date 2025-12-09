import express from 'express'
import * as chiefComplaintController from './chief-complaint.controller.js'
import { auth } from "#middleware/auth.js";
import { personnelRoles } from '#utils/constants.js';
import validate from '#middleware/validateRequests.js'
import { getPersonnelById } from '#modules/personnel/personnel.validation.js';
import upload, { handleMulterError } from '#middleware/upload.js';
const router = express.Router();

router.get('/analytics/dashboard', auth('Doctor', 'Admin'), chiefComplaintController.getComplaintAnalyticsDashboard);

router.get('/analytics/auto-comparison', auth('Doctor', 'Admin'), chiefComplaintController.getAutoSchoolComparison);

router.get('/trends/by-school', auth('Doctor', 'Admin'), chiefComplaintController.getComplaintTrendsBySchool);

router.get('/trends/top-complaints', auth('Doctor', 'Admin'), chiefComplaintController.getTopCommonComplaints);

router.get('/trends/time-series', auth('Doctor', 'Admin'), chiefComplaintController.getComplaintTimeSeries);

router.post('/trends/compare-schools', auth('Doctor', 'Admin'), chiefComplaintController.compareSchoolComplaintTrends);

router.route('/')
  .get(auth(...personnelRoles), chiefComplaintController.listChiefComplaints)
  .post(auth(...personnelRoles), upload.single('attachment'), handleMulterError, chiefComplaintController.createChiefComplaint)

router.get('/personnel-name', auth(...personnelRoles), chiefComplaintController.getChiefComplaintByPersonnelName)
router.get('/export', auth(...personnelRoles), chiefComplaintController.exportConsultationAndTreatmentRecord)
router.route('/:perId')
  .delete(auth('Admin'), validate({ params: getPersonnelById }), chiefComplaintController.deleteChiefComplaint)
  .put(auth(...personnelRoles), validate({ params: getPersonnelById }), upload.single('attachment'), handleMulterError, chiefComplaintController.updateChiefComplaint)
  .get(auth(...personnelRoles), validate({ params: getPersonnelById }), chiefComplaintController.getChiefComplaintById)

export default router
