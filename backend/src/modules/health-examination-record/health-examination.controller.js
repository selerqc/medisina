
import { StatusCodes } from "http-status-codes";
import asyncHandler from 'express-async-handler';
import healthExaminationService from "./health-examination.service.js";
import ApiError from "#utils/ApiError.js";
import { extractAuditInfo, getTemplatePath } from "#utils/helpers.js";
import ExcelJS from 'exceljs';
import fs from 'fs';
import logger from '#logger/logger.js';

export const createHealthExamination = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);
  const newRecord = await healthExaminationService.createHealthExamination(
    req.body,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.CREATED).json({
    message: 'Health Examination Record created successfully',
    data: newRecord
  });
});

export const getHealthExaminationById = asyncHandler(async (req, res) => {
  const { heId } = req.params;
  if (!heId) {
    throw new ApiError('Health Examination ID is required', StatusCodes.BAD_REQUEST);
  }
  const record = await healthExaminationService.getHealthExaminationById(heId);
  return res.status(StatusCodes.OK).json({
    data: record
  });
});

export const fetchAllHealthExaminations = asyncHandler(async (req, res) => {
  const { division, department, priority, startDate, endDate } = req.query;
  const filters = {};
  if (division) filters.division = division;
  if (department) filters.department = department;
  if (priority) filters.priority = priority;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  const result = await healthExaminationService.fetchAllHealthExaminations(filters);
  return res.status(StatusCodes.OK).json(result);
});

export const fetchMyHealthExaminations = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);
  const { division, department, priority, startDate, endDate } = req.query;
  const filters = {};
  if (division) filters.division = division;
  if (department) filters.department = department;
  if (priority) filters.priority = priority;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  const result = await healthExaminationService.fetchHealthExaminationsByUser(
    auditInfo.personnelId,
    filters
  );
  return res.status(StatusCodes.OK).json(result);
});

export const updateHealthExaminationById = asyncHandler(async (req, res) => {
  const { heId } = req.params;
  const auditInfo = extractAuditInfo(req.user);
  if (!heId) {
    throw new ApiError('Health Examination ID is required', StatusCodes.BAD_REQUEST);
  }
  const updatedRecord = await healthExaminationService.updateHealthExaminationById(
    heId,
    req.body,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.OK).json({
    message: 'Health Examination Record updated successfully',
    data: updatedRecord
  });
});

export const deleteHealthExaminationById = asyncHandler(async (req, res) => {
  const { heId } = req.params;
  const auditInfo = extractAuditInfo(req.user);
  if (!heId) {
    throw new ApiError('Health Examination ID is required', StatusCodes.BAD_REQUEST);
  }
  const result = await healthExaminationService.deleteHealthExaminationById(
    heId,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.OK).json(result);
});

export const restoreHealthExamination = asyncHandler(async (req, res) => {
  const { heId } = req.params;
  const auditInfo = extractAuditInfo(req.user);
  if (!heId) {
    throw new ApiError('Health Examination ID is required', StatusCodes.BAD_REQUEST);
  }
  const result = await healthExaminationService.restoreHealthExamination(
    heId,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.OK).json(result);
});

export const markAsCompleted = asyncHandler(async (req, res) => {
  const { heId } = req.params;
  const auditInfo = extractAuditInfo(req.user);
  if (!heId) {
    throw new ApiError('Health Examination ID is required', StatusCodes.BAD_REQUEST);
  }
  const result = await healthExaminationService.markAsCompleted(
    heId,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.OK).json(result);
});

export const getHealthExaminationCount = asyncHandler(async (req, res) => {
  const { onlyMine } = req.query;
  const auditInfo = extractAuditInfo(req.user);
  const userId = onlyMine === 'true' ? auditInfo.personnelId : null;
  const count = await healthExaminationService.getHealthExaminationCount(userId);
  return res.status(StatusCodes.OK).json({
    count,
    onlyMine: onlyMine === 'true'
  });
});

export const getStatsByDivision = asyncHandler(async (req, res) => {
  const { division } = req.params;
  const { year } = req.query;
  if (!division) {
    throw new ApiError('Division is required', StatusCodes.BAD_REQUEST);
  }
  const result = await healthExaminationService.getStatsByDivision(
    division,
    year ? parseInt(year) : undefined
  );
  return res.status(StatusCodes.OK).json(result);
});

export const getStatsByDepartment = asyncHandler(async (req, res) => {
  const { department } = req.params;
  const { year } = req.query;
  if (!department) {
    throw new ApiError('Department is required', StatusCodes.BAD_REQUEST);
  }
  const result = await healthExaminationService.getStatsByDepartment(
    department,
    year ? parseInt(year) : undefined
  );
  return res.status(StatusCodes.OK).json(result);
});

export const searchByName = asyncHandler(async (req, res) => {
  const { q, onlyMine } = req.query;
  const auditInfo = extractAuditInfo(req.user);
  if (!q) {
    throw new ApiError('Search query is required', StatusCodes.BAD_REQUEST);
  }
  const userId = onlyMine === 'true' ? auditInfo.personnelId : null;
  const result = await healthExaminationService.searchByName(q, userId);
  return res.status(StatusCodes.OK).json(result);
});

export const getRecordsByPriority = asyncHandler(async (req, res) => {
  const { priority } = req.params;
  const { onlyMine } = req.query;
  const auditInfo = extractAuditInfo(req.user);
  if (!priority) {
    throw new ApiError('Priority level is required', StatusCodes.BAD_REQUEST);
  }
  const userId = onlyMine === 'true' ? auditInfo.personnelId : null;
  const result = await healthExaminationService.getRecordsByPriority(priority, userId);
  return res.status(StatusCodes.OK).json(result);
});

export const getPendingFollowUps = asyncHandler(async (req, res) => {
  const { onlyMine } = req.query;
  const auditInfo = extractAuditInfo(req.user);
  const userId = onlyMine === 'true' ? auditInfo.personnelId : null;
  const result = await healthExaminationService.getPendingFollowUps(userId);
  return res.status(StatusCodes.OK).json(result);
});

export const getRecordsByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate, onlyMine } = req.query;
  const auditInfo = extractAuditInfo(req.user);
  if (!startDate || !endDate) {
    throw new ApiError('Start date and end date are required', StatusCodes.BAD_REQUEST);
  }
  const userId = onlyMine === 'true' ? auditInfo.personnelId : null;
  const result = await healthExaminationService.getRecordsByDateRange(
    startDate,
    endDate,
    userId
  );
  return res.status(StatusCodes.OK).json(result);
});

export const bulkDeleteHealthExaminations = asyncHandler(async (req, res) => {
  const { heIds } = req.body;
  const auditInfo = extractAuditInfo(req.user);
  if (!heIds || !Array.isArray(heIds) || heIds.length === 0) {
    throw new ApiError('Array of Health Examination IDs is required', StatusCodes.BAD_REQUEST);
  }
  const result = await healthExaminationService.bulkDelete(
    heIds,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.OK).json(result);
});

export const approveHealthExamination = asyncHandler(async (req, res) => {
  const { heId } = req.params;
  const { physicianName, physicianSignature, licenseNumber, remarks } = req.body;
  const auditInfo = extractAuditInfo(req.user);

  if (!heId) {
    throw new ApiError('Health Examination ID is required', StatusCodes.BAD_REQUEST);
  }

  const result = await healthExaminationService.approveHealthExamination(
    heId,
    {
      physicianName,
      physicianSignature,
      licenseNumber,
      remarks
    },
    auditInfo.personnelId
  );

  return res.status(StatusCodes.OK).json(result);
});

export const exportHealthExamination = asyncHandler(async (req, res) => {
  const { heId } = req.params;

  if (!heId) {
    throw new ApiError("Health Examination ID is required", StatusCodes.BAD_REQUEST);
  }

  const record = await healthExaminationService.getHealthExaminationById(heId);

  if (!record) {
    throw new ApiError("Health Examination Record not found", StatusCodes.NOT_FOUND);
  }

  const workbook = new ExcelJS.Workbook();
  const templatePath = getTemplatePath('HEALTH EXAMINATION RECORD.xlsx');

  if (!fs.existsSync(templatePath)) {
    logger.error(`Template file not found at path: ${templatePath}`);
    logger.error(`Current working directory: ${process.cwd()}`);
    logger.error(`Directory contents: ${fs.existsSync(process.cwd() + '/templates') ? fs.readdirSync(process.cwd() + '/templates').join(', ') : 'templates directory not found'}`);
    throw new ApiError(`Template file not found: ${templatePath}`, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  try {
    await workbook.xlsx.readFile(templatePath);
  } catch (error) {
    logger.error(`Failed to load health examination record template: ${error.message}`, { error, templatePath });
    throw new ApiError(`Failed to load health examination record template: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const sheet = workbook.getWorksheet(1) || workbook.worksheets[0];

  if (!sheet) {
    throw new ApiError("Template worksheet not found", StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const setCellValue = (cell, value) => {
    if (sheet.getCell(cell)) {
      sheet.getCell(cell).value = value || '';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  setCellValue('B3', record.name || '');
  setCellValue('C4', formatDate(record.dateOfBirth));
  setCellValue('N3', record.division || '');
  setCellValue('N4', record.typeOfWork || '');
  setCellValue('X3', record.department || '');
  setCellValue('W4', record.sex || '');
  setCellValue('AB4', record.civilStatus || '');

  if (record.exam) {

    const exam = record.exam;

    if (exam.date) {

      setCellValue('C6', formatDate(exam.date));
    }

    setCellValue('D7', exam.height || '');
    setCellValue('D8', exam.weight || '');

    setCellValue('D9', exam.temperature || '');

    setCellValue('E11', exam.respiratorySystem?.fluorography || '');
    setCellValue('E12', exam.respiratorySystem?.sputumAnalysis || '');

    setCellValue('E14', exam.circulatorySystem?.bloodPressure || '');
    setCellValue('E15', exam.circulatorySystem?.pulse || '');
    setCellValue('E16', exam.circulatorySystem?.sitting || '');
    setCellValue('J16', exam.circulatorySystem?.agilityTest || '');

    setCellValue('D17', exam.digestiveSystem || '');

    setCellValue('E19', exam.genitoUrinary?.urinalysis || '');

    setCellValue('E20', exam.skin || '');

    setCellValue('E21', exam.locomotorSystem || '');

    setCellValue('E22', exam.nervousSystem || '');

    setCellValue('H23', exam.eyes?.conjunctivitis || '');
    setCellValue('E24', exam.eyes?.colorPerception || '');

    if (exam.vision) {
      setCellValue('F26', exam.vision.withGlasses?.far || '');
      setCellValue('I26', exam.vision.withGlasses?.near || '');
      setCellValue('F27', exam.vision.withoutGlasses?.far || '');
      setCellValue('I27', exam.vision.withoutGlasses?.near || '');
    }

    setCellValue('C28', exam.nose || '');

    setCellValue('C29', exam.ear || '');

    if (exam.hearing) {
      setCellValue('D31', exam.hearing.right || '');
      setCellValue('F31', exam.hearing.left || '');
    }

    setCellValue('D32', exam.throat || '');

    setCellValue('D33', exam.teethAndGums || '');

    setCellValue('D34', exam.immunization || '');

    setCellValue('D35', exam.remarks || '');

    setCellValue('D36', exam.recommendation || '');

    if (exam.employee) {
      setCellValue('E38', exam.employee.name || '');
      setCellValue('E37', formatDate(exam.employee.date));
    }

    if (exam.physician) {
      setCellValue('E40', exam.physician.name || '');
      setCellValue('E39', formatDate(exam.physician.date));
    }
  }

  const fileName = `Health_Examination_Record_${record.heId}_${new Date().toISOString().split('T')[0]}.xlsx`;

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}"`
  );
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  await workbook.xlsx.write(res);
  res.end();
});
