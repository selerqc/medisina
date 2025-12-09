import express from 'express';
import { auth } from '#middleware/auth.js';
import validate from '#middleware/validateRequests.js';
import upload, { handleMulterError } from '#middleware/upload.js';
import * as personnelApprovalController from './personnel-approval.controller.js';
import { getPersonnelById } from './personnel.validation.js';
import { stdIdParam } from '#modules/student/student.validation.js';
const router = express.Router();

router
  .route('/health-records/pending')
  .get(auth('Doctor', 'Admin'), personnelApprovalController.getPendingApprovals);

router
  .route('/health-records/approved')
  .get(auth('Doctor', 'Admin'), personnelApprovalController.getApprovedRecords);

router
  .route('/health-records/personnel/:perId/approve')
  .post(auth('Doctor', 'Admin'), upload.single('file'), handleMulterError, validate({ params: getPersonnelById }), personnelApprovalController.approvePersonnelHealthRecord);

router
  .route('/health-records/school/:stdId/approve')
  .post(auth('Doctor', 'Admin'), upload.single('file'), handleMulterError, validate({ params: stdIdParam }), personnelApprovalController.approveSchoolHealthRecord);

router
  .route('/health-records/chief-complaint/:perId/approve')
  .post(auth('Doctor', 'Admin'), upload.single('file'), handleMulterError, personnelApprovalController.approveChiefComplaint);

export default router;
