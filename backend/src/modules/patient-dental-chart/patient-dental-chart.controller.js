import patientDentalChartService from './patient-dental-chart.service.js';
import ApiError from '#utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { extractAuditInfo } from '#utils/helpers.js';

export const getAllRecords = asyncHandler(async (req, res) => {
  const records = await patientDentalChartService.getAllRecords();

  return res.status(StatusCodes.OK).json({
    success: true,
    data: records,
    message: 'Patient dental charts retrieved successfully'
  });
});

export const getRecordById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const record = await patientDentalChartService.getRecordById(id);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: record,
    message: 'Patient dental chart retrieved successfully'
  });
});

export const getRecordsByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { patientType } = req.query;

  if (!patientType || !['student', 'personnel'].includes(patientType)) {
    throw new ApiError('Valid patient type (student or personnel) is required', StatusCodes.BAD_REQUEST);
  }

  const records = await patientDentalChartService.getRecordsByPatient(patientId, patientType);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: records,
    message: 'Patient dental charts retrieved successfully'
  });
});

export const createRecord = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);

  const recordData = {
    ...req.body,
    attendedBy: auditInfo.personnelId,
    lastModifiedBy: auditInfo.personnelId
  };

  // Clean up empty references
  if (recordData.student === '' || recordData.student === null) {
    delete recordData.student;
  }
  if (recordData.personnel === '' || recordData.personnel === null) {
    delete recordData.personnel;
  }

  const record = await patientDentalChartService.createRecord(recordData);

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: record,
    message: 'Patient dental chart created successfully'
  });
});

export const updateRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const auditInfo = extractAuditInfo(req.user);

  const updateData = {
    ...req.body,
    lastModifiedBy: auditInfo.personnelId
  };

  // Remove empty string fields
  if (updateData.student === '' || updateData.student === null) {
    delete updateData.student;
  }
  if (updateData.personnel === '' || updateData.personnel === null) {
    delete updateData.personnel;
  }

  const record = await patientDentalChartService.updateRecord(id, updateData);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: record,
    message: 'Patient dental chart updated successfully'
  });
});

export const deleteRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await patientDentalChartService.deleteRecord(id);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Patient dental chart deleted successfully'
  });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const stats = await patientDentalChartService.getDashboardStats(filters);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: stats,
    message: 'Dashboard statistics retrieved successfully'
  });
});
