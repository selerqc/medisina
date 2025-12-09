import express from "express";
import * as SchoolHealthExamRoute from "./school-health-exam-card.controller.js";
import validate from "#middleware/validateRequests.js";
import { auth } from "#middleware/auth.js";
import {
  createSchoolHealthExamCard,
  stdIdParam,
  updateSchoolHealthExamCard,
  updateExaminationSchema,
  stdIdGradeParam,
} from "./school-health-exam-card.validation.js";
import { personnelRoles } from "#utils/constants.js";

const router = express.Router();

router.use(auth(...personnelRoles));

// USER ACCESS INFO
router.get("/user/schools", SchoolHealthExamRoute.getUserSchools);

router
  .route("/")
  .post(validate({ body: createSchoolHealthExamCard }), SchoolHealthExamRoute.createHealthCard)
  .get(SchoolHealthExamRoute.getAllGradeExamination);

router
  .route("/:stdId/:grade")
  .put(validate({ params: stdIdGradeParam }), validate({ body: updateExaminationSchema }), SchoolHealthExamRoute.updateGradeExamination)
  .delete(validate({ params: stdIdGradeParam }), SchoolHealthExamRoute.deleteGradeExamination);

// APPROVAL WORKFLOWS  
router.get("/pending", SchoolHealthExamRoute.getPendingApprovals);
router.get("/approved", SchoolHealthExamRoute.getApprovedRecords);
// router.post("/approve/:stdId/:grade", validate({ params: stdIdGradeParam }), SchoolHealthExamRoute.approveHealthRecord);

// BASIC DATA RETRIEVAL
router.get("/count", SchoolHealthExamRoute.getAllSchoolHealthRecordCount);
router.get("/statistics", SchoolHealthExamRoute.getHealthStatistics);
router.get("/nutritional-summary", SchoolHealthExamRoute.getNutritionalStatusSummary);
router.get("/dashboard/preventive-programs", SchoolHealthExamRoute.getPreventiveProgramsStats);
router.get("/dashboard/screenings", SchoolHealthExamRoute.getRecentScreenings);
router.get("/dashboard/dss-alerts", SchoolHealthExamRoute.getDSSAlertsBreakdown);

router.post("/:recordId/generate-prescription", SchoolHealthExamRoute.generatePrescriptionFromRecord);

// STUDENT-SPECIFIC QUERIES
router.get("/students/attending-examiner", SchoolHealthExamRoute.getAllRecordsByAttendingExaminer);
router.get("/students/export", SchoolHealthExamRoute.exportHealthRecord);
router.get("/students/:stdId/history", validate({ params: stdIdParam }), SchoolHealthExamRoute.getExaminationHistory);
router.get("/students/:stdId/dss", validate({ params: stdIdParam }), SchoolHealthExamRoute.getStudentDSSReport);
// FILTERING & GROUPING  
router.get("/grade/:grade", SchoolHealthExamRoute.getCardsByGrade);
router.get("/grade/:grade/pending", SchoolHealthExamRoute.getPendingExaminationsByGrade);
router.get("/grade/:grade/approved", SchoolHealthExamRoute.getApprovedExaminationsByGrade);
router.get("/school/:schoolId", SchoolHealthExamRoute.getCardsBySchool);
router.get("/follow-up", SchoolHealthExamRoute.getStudentsRequiringFollowUp);
router.get("/follow-up/export", SchoolHealthExamRoute.exportHighPriorityAlerts);

// DSS & ANALYTICS
router.get("/dss-summary", SchoolHealthExamRoute.getDSSSummary);
router.get("/bulk-dss-assessments", SchoolHealthExamRoute.getBulkDSSAssessments);
router.post("/generate-dss/:recordId", SchoolHealthExamRoute.generateDSSAssessment);
router.get("/students-by-category/:category", SchoolHealthExamRoute.getStudentsByCategory);


// SCHOOL ANALYSIS & COMMON FINDINGS
router.get("/school/:schoolId/analyze", SchoolHealthExamRoute.analyzeSchoolHealthRecords);
router.get("/school/:schoolId/common-findings", SchoolHealthExamRoute.getSchoolCommonFindings);
router.get("/school/:schoolId/trends", SchoolHealthExamRoute.getSchoolHealthTrends);
router.get("/school/:schoolId/action-plan", SchoolHealthExamRoute.getSchoolHealthActionPlan);
router.post("/schools/comparison", SchoolHealthExamRoute.getSchoolHealthComparison);

export default router;
