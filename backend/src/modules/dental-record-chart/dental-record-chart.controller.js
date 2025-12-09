import dentalRecordChartService from './dental-record-chart.service.js';
import ApiError from '#utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { extractAuditInfo } from '#utils/helpers.js';

export const getAllRecords = asyncHandler(async (req, res) => {
  const records = await dentalRecordChartService.getAllRecords();

  return res.status(StatusCodes.OK).json({
    success: true,
    data: records,
    message: 'Dental record charts retrieved successfully'
  });
});

export const getRecordById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const record = await dentalRecordChartService.getRecordById(id);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: record,
    message: 'Dental record chart retrieved successfully'
  });
});

export const getRecordsByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { patientType } = req.query;

  if (!patientType || !['student', 'personnel'].includes(patientType)) {
    throw new ApiError('Valid patient type (student or personnel) is required', StatusCodes.BAD_REQUEST);
  }

  const records = await dentalRecordChartService.getRecordsByPatient(patientId, patientType);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: records,
    message: 'Patient dental record charts retrieved successfully'
  });
});

export const createRecord = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);

  const recordData = {
    ...req.body,
    attendedBy: auditInfo.userId,
    lastModifiedBy: auditInfo.userId
  };

  // Clean up empty references
  if (recordData.student === '' || recordData.student === null) {
    delete recordData.student;
  }
  if (recordData.personnel === '' || recordData.personnel === null) {
    delete recordData.personnel;
  }

  const record = await dentalRecordChartService.createRecord(recordData);

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: record,
    message: 'Dental record chart created successfully'
  });
});

export const updateRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const auditInfo = extractAuditInfo(req.user);

  const updateData = {
    ...req.body,
    lastModifiedBy: auditInfo.userId
  };

  // Remove empty string fields to prevent MongoDB cast errors
  if (updateData.student === '' || updateData.student === null) {
    delete updateData.student;
  }
  if (updateData.personnel === '' || updateData.personnel === null) {
    delete updateData.personnel;
  }

  const record = await dentalRecordChartService.updateRecord(id, updateData);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: record,
    message: 'Dental record chart updated successfully'
  });
});

export const deleteRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await dentalRecordChartService.deleteRecord(id);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Dental record chart deleted successfully'
  });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const stats = await dentalRecordChartService.getDashboardStats(filters);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: stats,
    message: 'Dashboard statistics retrieved successfully'
  });
});
