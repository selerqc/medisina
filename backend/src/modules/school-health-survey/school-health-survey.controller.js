import { StatusCodes } from 'http-status-codes';
import ApiError from '#utils/ApiError.js';
import asyncHandler from 'express-async-handler';
import schoolHealthSurveyService from './school-health-survey.service.js';
import { extractAuditInfo } from '#utils/helpers.js';

const createSchoolHealthSurvey = asyncHandler(async (req, res) => {
  const schoolHealthSurvey = await schoolHealthSurveyService.createSchoolHealthSurvey({
    ...req.body,
    createdBy: req.user.id
  });
  res.status(StatusCodes.CREATED).json(schoolHealthSurvey);
});

const getSchoolHealthSurveys = asyncHandler(async (req, res) => {
  const { year, surveyStatus } = req.query;
  const filter = { year, surveyStatus };
  const auditInfo = extractAuditInfo(req.user)

  const examiner = auditInfo.personnelType === 'Doctor' ? null : auditInfo.personnelId;
  const result = await schoolHealthSurveyService.querySchoolHealthSurveys(filter, examiner);
  res.status(StatusCodes.OK).json(result);
});

const getSchoolHealthSurvey = asyncHandler(async (req, res) => {
  const schoolHealthSurvey = await schoolHealthSurveyService.getSchoolHealthSurveyById(req.params.schoolHealthSurveyId);
  if (!schoolHealthSurvey) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'School Health Survey not found');
  }
  res.status(StatusCodes.OK).json(schoolHealthSurvey);
});

const updateSchoolHealthSurvey = asyncHandler(async (req, res) => {
  const schoolHealthSurvey = await schoolHealthSurveyService.updateSchoolHealthSurveyById(
    req.params.schoolHealthSurveyId,
    {
      ...req.body,
      updatedBy: req.user.id
    }
  );
  res.status(StatusCodes.OK).json(schoolHealthSurvey);
});

const deleteSchoolHealthSurvey = asyncHandler(async (req, res) => {
  await schoolHealthSurveyService.deleteSchoolHealthSurveyById(req.params.schoolHealthSurveyId);
  res.status(StatusCodes.NO_CONTENT).json();
});

const getSchoolHealthSurveysByYear = asyncHandler(async (req, res) => {
  const result = await schoolHealthSurveyService.getSchoolHealthSurveysByYear(req.params.year);
  res.status(StatusCodes.OK).json(result);
});

const getSchoolHealthSurveysByRegionDivision = asyncHandler(async (req, res) => {
  const { region, division } = req.params;
  const { year } = req.query;
  const result = await schoolHealthSurveyService.getSchoolHealthSurveysByRegionDivision(region, division, year);
  res.status(StatusCodes.OK).json(result);
});

const markSurveyAsCompleted = asyncHandler(async (req, res) => {
  const schoolHealthSurvey = await schoolHealthSurveyService.markSurveyAsCompleted(req.params.schoolHealthSurveyId);
  res.status(StatusCodes.OK).json(schoolHealthSurvey);
});

const markSurveyAsSubmitted = asyncHandler(async (req, res) => {
  const schoolHealthSurvey = await schoolHealthSurveyService.markSurveyAsSubmitted(req.params.schoolHealthSurveyId);
  res.status(StatusCodes.OK).json(schoolHealthSurvey);
});

const approveSurvey = asyncHandler(async (req, res) => {
  const { remarks } = req.body;
  const schoolHealthSurvey = await schoolHealthSurveyService.approveSurvey(
    req.params.schoolHealthSurveyId,
    req.user._id,
    remarks
  );
  res.status(StatusCodes.OK).json(schoolHealthSurvey);
});

const rejectSurvey = asyncHandler(async (req, res) => {
  const { remarks } = req.body;
  const schoolHealthSurvey = await schoolHealthSurveyService.rejectSurvey(
    req.params.schoolHealthSurveyId,
    req.user._id,
    remarks
  );
  res.status(StatusCodes.OK).json(schoolHealthSurvey);
});

const getPendingSurveys = asyncHandler(async (req, res) => {
  const result = await schoolHealthSurveyService.getPendingSurveys();
  res.status(StatusCodes.OK).json(result);
});

const getSubmittedSurveys = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.schoolId) {
    filter.schoolId = req.query.schoolId;
  }
  const result = await schoolHealthSurveyService.getSubmittedSurveys(filter);
  res.status(StatusCodes.OK).json(result);
});

const getApprovedSurveys = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.schoolId) {
    filter.schoolId = req.query.schoolId;
  }
  const result = await schoolHealthSurveyService.getApprovedSurveys(filter);
  res.status(StatusCodes.OK).json(result);
});

const getRejectedSurveys = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.schoolId) {
    filter.schoolId = req.query.schoolId;
  }
  const result = await schoolHealthSurveyService.getRejectedSurveys(filter);
  res.status(StatusCodes.OK).json(result);
});

const getRegionalStatistics = asyncHandler(async (req, res) => {
  const { region, year } = req.params;
  const result = await schoolHealthSurveyService.getRegionalStatistics(region, year);
  res.status(StatusCodes.OK).json(result);
});

const getSurveyStatistics = asyncHandler(async (req, res) => {
  const schoolHealthSurvey = await schoolHealthSurveyService.getSchoolHealthSurveyById(req.params.schoolHealthSurveyId);
  if (!schoolHealthSurvey) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'School Health Survey not found');
  }

  const statistics = {
    totalEnrollment: schoolHealthSurvey.totalEnrollment,
    totalPersonnel: schoolHealthSurvey.totalPersonnel,
    totalDropouts: schoolHealthSurvey.totalDropouts,
    totalExamined: schoolHealthSurvey.calculateTotalExamined(),
    healthProblemsPercentage: schoolHealthSurvey.calculateHealthProblemsPercentage()
  };

  res.status(StatusCodes.OK).json(statistics);
});

const bulkUpdateStatus = asyncHandler(async (req, res) => {
  const { surveyIds, status } = req.body;
  const result = await schoolHealthSurveyService.bulkUpdateStatus(surveyIds, status, req.user.id);
  res.status(StatusCodes.OK).json(result);
});

const duplicateSurvey = asyncHandler(async (req, res) => {
  const { newYear } = req.body;
  const schoolHealthSurvey = await schoolHealthSurveyService.duplicateSurvey(
    req.params.schoolHealthSurveyId,
    newYear,
    req.user.id
  );
  res.status(StatusCodes.CREATED).json(schoolHealthSurvey);
});

const exportSurveyData = asyncHandler(async (req, res) => {
  const { region, division, year, surveyStatus } = req.query;
  const filter = { region, division, year, surveyStatus };
  const exportData = await schoolHealthSurveyService.exportSurveyData(filter);
  res.status(StatusCodes.OK).json(exportData);
});

const getEnrollmentStatistics = asyncHandler(async (req, res) => {
  const { schoolId, schoolYear } = req.query;

  const targetSchoolId = schoolId || req.user.schoolId?.[0];
  const targetSchoolYear = schoolYear || new Date().getFullYear().toString();

  if (!targetSchoolId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'School ID is required');
  }

  const enrollmentData = await schoolHealthSurveyService.getEnrollmentStatisticsBySchool(
    targetSchoolId,
    targetSchoolYear
  );

  res.status(StatusCodes.OK).json(enrollmentData);
});

const getPersonnelStatistics = asyncHandler(async (req, res) => {
  const { schoolId } = req.query;

  const targetSchoolId = schoolId || req.user.schoolId?.[0];

  if (!targetSchoolId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'School ID is required');
  }

  const personnelData = await schoolHealthSurveyService.getPersonnelStatisticsBySchool(targetSchoolId);

  res.status(StatusCodes.OK).json(personnelData);
});

const getExaminedAssessedStatistics = asyncHandler(async (req, res) => {
  const { schoolId, schoolYear } = req.query;

  const targetSchoolId = schoolId || req.user.schoolId?.[0];
  const targetSchoolYear = schoolYear || new Date().getFullYear().toString();

  if (!targetSchoolId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'School ID is required');
  }

  const examinedData = await schoolHealthSurveyService.getExaminedAssessedStatisticsBySchool(
    targetSchoolId,
    targetSchoolYear
  );

  res.status(StatusCodes.OK).json(examinedData);
});

const getCommonSignsSymptoms = asyncHandler(async (req, res) => {
  const { schoolId, schoolYear } = req.query;

  const targetSchoolId = schoolId || req.user.schoolId?.[0];
  const targetSchoolYear = schoolYear || new Date().getFullYear().toString();

  if (!targetSchoolId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'School ID is required');
  }

  const signsData = await schoolHealthSurveyService.getCommonSignsSymptomsBySchool(
    targetSchoolId,
    targetSchoolYear
  );

  res.status(StatusCodes.OK).json(signsData);
});

const getHealthProfileStatistics = asyncHandler(async (req, res) => {
  const { schoolId, schoolYear, autoPopulate, surveyId } = req.query;

  const targetSchoolId = schoolId || req.user.schoolId?.[0];
  const targetSchoolYear = schoolYear || new Date().getFullYear().toString();

  if (!targetSchoolId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'School ID is required');
  }

  const healthProfileData = await schoolHealthSurveyService.getHealthProfileStatisticsBySchool(
    targetSchoolId,
    targetSchoolYear,
    autoPopulate === 'true',
    surveyId
  );

  res.status(StatusCodes.OK).json(healthProfileData);
});

const autoPopulateData = asyncHandler(async (req, res) => {
  const { schoolHealthSurveyId } = req.params;
  const { schoolId, schoolYear } = req.body;

  const targetSchoolId = schoolId || req.user.schoolId?.[0];
  const targetSchoolYear = schoolYear || new Date().getFullYear().toString();

  if (!targetSchoolId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'School ID is required');
  }

  const result = await schoolHealthSurveyService.getHealthProfileStatisticsBySchool(
    targetSchoolId,
    targetSchoolYear,
    true,
    schoolHealthSurveyId
  );

  res.status(StatusCodes.OK).json(result);
});

const getConsolidatedStatisticsByDivisionGradeMonth = asyncHandler(async (req, res) => {
  const { gradeFrom, gradeTo, month, year } = req.query;

  const result = await schoolHealthSurveyService.getConsolidatedStatisticsByDivisionGradeMonth({
    gradeFrom,
    gradeTo,
    month: parseInt(month),
    year: parseInt(year)
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: result
  });
});

const exportConsolidatedReportToExcel = asyncHandler(async (req, res) => {
  const { gradeFrom, gradeTo, month, year } = req.query;
  const result = await schoolHealthSurveyService.exportConsolidatedReportToExcel({
    gradeFrom,
    gradeTo,
    month: parseInt(month),
    year: parseInt(year),
    preparedBy: req.user
  });

  // Set headers for file download
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

  res.send(result.buffer);
});

export {
  createSchoolHealthSurvey,
  getSchoolHealthSurveys,
  getSchoolHealthSurvey,
  updateSchoolHealthSurvey,
  deleteSchoolHealthSurvey,
  getSchoolHealthSurveysByYear,
  getSchoolHealthSurveysByRegionDivision,
  markSurveyAsCompleted,
  markSurveyAsSubmitted,
  approveSurvey,
  rejectSurvey,
  getPendingSurveys,
  getSubmittedSurveys,
  getApprovedSurveys,
  getRejectedSurveys,
  getRegionalStatistics,
  getSurveyStatistics,
  bulkUpdateStatus,
  duplicateSurvey,
  exportSurveyData,
  getEnrollmentStatistics,
  getPersonnelStatistics,
  getExaminedAssessedStatistics,
  getCommonSignsSymptoms,
  getHealthProfileStatistics,
  autoPopulateData,
  getConsolidatedStatisticsByDivisionGradeMonth,
  exportConsolidatedReportToExcel
};