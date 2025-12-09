import { StatusCodes } from "http-status-codes";
import asyncHandler from 'express-async-handler';
import referralSlipService from "./referral-slip.service.js";
import ApiError from "#utils/ApiError.js";
import { extractAuditInfo, getTemplatePath } from "#utils/helpers.js";
import ExcelJS from 'exceljs';
import path from 'path';

export const createReferralSlip = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);
  const newRecord = await referralSlipService.createReferralSlip(
    req.body,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.CREATED).json({
    message: 'Referral Slip created successfully',
    data: newRecord
  });
});

export const getReferralSlipById = asyncHandler(async (req, res) => {
  const { rsId } = req.params;
  if (!rsId) {
    throw new ApiError('Referral Slip ID is required', StatusCodes.BAD_REQUEST);
  }
  const record = await referralSlipService.getReferralSlipById(rsId);
  return res.status(StatusCodes.OK).json({
    data: record
  });
});

export const fetchAllReferralSlips = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  const result = await referralSlipService.fetchAllReferralSlips(filters);
  return res.status(StatusCodes.OK).json(result);
});

export const fetchUserReferralSlips = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);
  const { startDate, endDate } = req.query;
  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  const result = await referralSlipService.fetchReferralSlipsByUser(
    auditInfo.personnelId,
    filters
  );
  return res.status(StatusCodes.OK).json(result);
});

export const updateReferralSlipById = asyncHandler(async (req, res) => {
  const { rsId } = req.params;
  const auditInfo = extractAuditInfo(req.user);
  if (!rsId) {
    throw new ApiError('Referral Slip ID is required', StatusCodes.BAD_REQUEST);
  }
  const updatedRecord = await referralSlipService.updateReferralSlipById(
    rsId,
    req.body,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.OK).json({
    message: 'Referral Slip updated successfully',
    data: updatedRecord
  });
});

export const deleteReferralSlipById = asyncHandler(async (req, res) => {
  const { rsId } = req.params;
  const auditInfo = extractAuditInfo(req.user);
  if (!rsId) {
    throw new ApiError('Referral Slip ID is required', StatusCodes.BAD_REQUEST);
  }
  const result = await referralSlipService.deleteReferralSlipById(
    rsId,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.OK).json(result);
});

export const restoreReferralSlip = asyncHandler(async (req, res) => {
  const { rsId } = req.params;
  const auditInfo = extractAuditInfo(req.user);
  if (!rsId) {
    throw new ApiError('Referral Slip ID is required', StatusCodes.BAD_REQUEST);
  }
  const result = await referralSlipService.restoreReferralSlip(
    rsId,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.OK).json(result);
});

export const updateReturnSlip = asyncHandler(async (req, res) => {
  const { rsId } = req.params;
  const auditInfo = extractAuditInfo(req.user);
  if (!rsId) {
    throw new ApiError('Referral Slip ID is required', StatusCodes.BAD_REQUEST);
  }
  const updatedRecord = await referralSlipService.updateReturnSlip(
    rsId,
    req.body,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.OK).json({
    message: 'Return Slip updated successfully',
    data: updatedRecord
  });
});

export const getReferralSlipCount = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);
  const count = await referralSlipService.getReferralSlipCount(auditInfo.personnelId);
  return res.status(StatusCodes.OK).json({
    count,
    onlyMine: onlyMine === 'true'
  });
});

export const searchByPatientName = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const auditInfo = extractAuditInfo(req.user);
  if (!q) {
    throw new ApiError('Search query is required', StatusCodes.BAD_REQUEST);
  }
  const result = await referralSlipService.searchByPatientName(q, auditInfo.personnelId);
  return res.status(StatusCodes.OK).json(result);
});

export const getPendingReturnSlips = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);
  const result = await referralSlipService.getPendingReturnSlips(auditInfo.personnelId);
  return res.status(StatusCodes.OK).json(result);
});

export const getCompletedReferrals = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);
  const result = await referralSlipService.getCompletedReferrals(auditInfo.personnelId);
  return res.status(StatusCodes.OK).json(result);
});

export const getRecordsByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate, onlyMine } = req.query;
  const auditInfo = extractAuditInfo(req.user);
  if (!startDate || !endDate) {
    throw new ApiError('Start date and end date are required', StatusCodes.BAD_REQUEST);
  }
  const userId = onlyMine === 'true' ? auditInfo.personnelId : null;
  const result = await referralSlipService.getRecordsByDateRange(
    startDate,
    endDate,
    userId
  );
  return res.status(StatusCodes.OK).json(result);
});

export const bulkDeleteReferralSlips = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const auditInfo = extractAuditInfo(req.user);
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError('Array of Referral Slip IDs is required', StatusCodes.BAD_REQUEST);
  }
  const result = await referralSlipService.bulkDelete(
    ids,
    auditInfo.personnelId
  );
  return res.status(StatusCodes.OK).json(result);
});


export const getReferralsByReferrer = asyncHandler(async (req, res) => {
  const { referrerName } = req.params;
  const auditInfo = extractAuditInfo(req.user);
  if (!referrerName) {
    throw new ApiError('Referrer name is required', StatusCodes.BAD_REQUEST);
  }
  const result = await referralSlipService.getReferralsByReferrer(referrerName, auditInfo.personnelId);
  return res.status(StatusCodes.OK).json(result);
});

export const exportReferralSlipToExcel = asyncHandler(async (req, res) => {
  const { rsId } = req.params;

  if (!rsId) {
    throw new ApiError('Referral Slip ID is required', StatusCodes.BAD_REQUEST);
  }

  const record = await referralSlipService.getReferralSlipById(rsId);

  if (!record) {
    throw new ApiError('Referral Slip not found', StatusCodes.NOT_FOUND);
  }

  const workbook = new ExcelJS.Workbook();
  const templatePath = getTemplatePath('Referral Slip.xlsx');

  try {
    await workbook.xlsx.readFile(templatePath);
  } catch (err) {
    throw new ApiError(`Template file not found: ${templatePath}`, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new ApiError('Invalid template format', StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const { referralSlip } = record;

  // Helper function to safely set cell value
  const setCellValue = (cellAddress, value) => {
    try {
      if (value !== null && value !== undefined && value !== '') {
        const cell = worksheet.getCell(cellAddress);
        cell.value = value;
      }
    } catch (error) {
      console.error(`Error setting cell ${cellAddress}:`, error.message);
    }
  };

  setCellValue('B9', referralSlip.to && referralSlip.agency ? `${referralSlip.to} ${referralSlip.agency}` : referralSlip.to || referralSlip.agency);
  setCellValue('L9', referralSlip.date ? new Date(referralSlip.date).toLocaleDateString() : '');
  setCellValue('D11', referralSlip.address);
  setCellValue('D15', referralSlip.name);
  setCellValue('M15', referralSlip.age);
  setCellValue('O15', referralSlip.sex);
  setCellValue('F16', referralSlip.addressOrSchool);
  setCellValue('M16', referralSlip.grade);
  setCellValue('A18', referralSlip.chiefComplaint);
  setCellValue('E20', referralSlip.impression);
  setCellValue('E21', referralSlip.remarks);
  setCellValue('M22', referralSlip.referrerName);
  setCellValue('M24', referralSlip.referrerDesignation);
  // setCellValue('N22', referralSlip.signatureString);


  const { returnSlip } = record;

  if (returnSlip) {
    setCellValue('E31', returnSlip.returnedTo);
    setCellValue('F32', returnSlip.nameOfPatient);
    setCellValue('M32', returnSlip.dateReferred ? new Date(returnSlip.dateReferred).toLocaleDateString() : '');
    setCellValue('F33', returnSlip.chiefComplaint);
    setCellValue('E34', returnSlip.findings);
    setCellValue('G35', returnSlip.actionOrRecommendations);
    setCellValue('M39', returnSlip.signatureName);
    setCellValue('M41', returnSlip.designation);
  }
  setCellValue('B39', referralSlip.date ? new Date(referralSlip.date).toLocaleDateString() : '');
  if (referralSlip.signatureString) {
    try {
      const base64Data = referralSlip.signatureString.replace(/^data:image\/\w+;base64,/, '');

      const imageId = workbook.addImage({
        base64: base64Data,
        extension: 'png', 
      });


      worksheet.addImage(imageId, {
        tl: { col: 12, row: 20 },
        ext: { width: 150, height: 50 },
      });
    } catch (error) {
      console.error('Error adding signature image:', error.message);
    }
  }

  // Add return slip signature image if exists
  // if (returnSlip && returnSlip.signatureName) {
  //   try {
  //     // If signatureName contains base64 data
  //     if (returnSlip.signatureName.startsWith('data:image')) {
  //       const base64Data = returnSlip.signatureName.replace(/^data:image\/\w+;base64,/, '');

  //       const imageId = workbook.addImage({
  //         base64: base64Data,
  //         extension: 'png',
  //       });

  //       worksheet.addImage(imageId, {
  //         tl: { col: 2, row: 37 }, // Column C, Row 38
  //         ext: { width: 150, height: 50 },
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error adding return slip signature image:', error.message);
  //   }
  // }

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer();

  const fileName = `Referral_Slip_${rsId}_${Date.now()}.xlsx`;

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Length', buffer.length);

  return res.send(buffer);
});

