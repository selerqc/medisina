
import express from 'express';
const router = express.Router();

import Personnel from '#modules/personnel/personnel.route.js'
import AuthRoute from '#modules/auth/auth.route.js'
import PersonnelHealthCardRoute from '#modules/personnel-health-card/personnel-health-card.route.js'
import SchoolHealthExamRoute from '#modules/school-health-exam-card/school-health-exam-card.route.js'
import ChiefComplaintRoute from '#modules/chief-complaint/chief-complaint.route.js';
import AuditTrailRoute from '#modules/audit-trail/audit-trail.route.js'
import StudentRoute from '#modules/student/student.route.js'
import PersonnelApprovalRoute from '#modules/personnel/personnel-approval.route.js'
import NotificationRoute from '#modules/notifications/notification.route.js'
import DailyTreatmentRoute from '#modules/daily-treatment-record/daily-treatment-record.route.js'
import DentalTreatmentRoute from '#modules/dental-treatment-record/dental-treatment-record.route.js'
import DentalRecordChartRoute from '#modules/dental-record-chart/dental-record-chart.route.js'
import PatientDentalChartRoute from '#modules/patient-dental-chart/patient-dental-chart.route.js'
import SchoolHealthSurveyRoute from '#modules/school-health-survey/school-health-survey.route.js';
import AnnualAccomplishmentReportRoute from '#modules/annual-accomplishment-report/annual-accomplishment-report.route.js';
import HealthExaminationRoute from '#modules/health-examination-record/health-examination.route.js';
import ReferralSlipRoute from '#modules/referaal-slip/referral-slip.route.js';
import PrescriptionRoute from '#modules/prescription/prescription.route.js';
import { StatusCodes } from 'http-status-codes';

router.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
  });
});

router.get('/secret', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: StatusCodes.IM_A_TEAPOT,
    message: "Charles Pogi"
  });
});

router.use('/audit-trail', AuditTrailRoute)
router.use('/personnel', Personnel)
router.use('/auth', AuthRoute)
router.use('/personnel-health-cards', PersonnelHealthCardRoute)
router.use('/school-health-cards', SchoolHealthExamRoute)
router.use('/chief-complaint', ChiefComplaintRoute)
router.use('/students', StudentRoute)
router.use('/personnel-approval', PersonnelApprovalRoute)
router.use('/notifications', NotificationRoute)
router.use('/daily-treatment-record', DailyTreatmentRoute)
router.use('/dental-treatment-record', DentalTreatmentRoute)
router.use('/dental-record-chart', DentalRecordChartRoute)
router.use('/patient-dental-chart', PatientDentalChartRoute)
router.use('/school-health-surveys', SchoolHealthSurveyRoute)
router.use('/annual-accomplishment-report', AnnualAccomplishmentReportRoute)
router.use('/health-examinations', HealthExaminationRoute)
router.use('/referral-slips', ReferralSlipRoute)
router.use('/prescriptions', PrescriptionRoute)


export default router;