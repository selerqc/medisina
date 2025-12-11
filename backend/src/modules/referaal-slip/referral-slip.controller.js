import { StatusCodes } from "http-status-codes";
import asyncHandler from 'express-async-handler';
import referralSlipService from "./referral-slip.service.js";
import ApiError from "#utils/ApiError.js";
import { extractAuditInfo, getTemplatePath } from "#utils/helpers.js";
import ExcelJS from 'exceljs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

  const { referralSlip, returnSlip } = record;

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size (8.5" x 11")

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  // Helper function to draw text
  const drawText = (text, x, y, options = {}) => {
    page.drawText(text || '', {
      x,
      y: height - y,
      size: options.size || 10,
      font: options.bold ? fontBold : font,
      color: rgb(0, 0, 0),
      ...options
    });
  };

  // Helper function to draw line
  const drawLine = (x1, y1, x2, y2) => {
    page.drawLine({
      start: { x: x1, y: height - y1 },
      end: { x: x2, y: height - y2 },
      thickness: 1,
      color: rgb(0, 0, 0)
    });
  };

  // Header
  drawText('Republic of the Philippines', width / 2 - 80, 40, { bold: true, size: 11 });
  drawText('Department of Education', width / 2 - 70, 55, { size: 10 });
  drawText('Region ___________________', width / 2 - 70, 70, { size: 10 });
  drawText('Division of ___________________', width / 2 - 80, 85, { size: 10 });

  // Title
  drawText('REFERRAL SLIP', width / 2 - 50, 120, { bold: true, size: 14 });

  // Referral Slip Section
  let yPos = 160;

  // To and Date
  drawText('To', 50, yPos, { size: 10 });
  const toText = referralSlip.to && referralSlip.agency
    ? `${referralSlip.to} ${referralSlip.agency}`
    : referralSlip.to || referralSlip.agency || '';
  drawText(toText, 100, yPos, { size: 10 });
  drawLine(90, yPos + 5, 400, yPos + 5);

  drawText('Date', 450, yPos, { size: 10 });
  const dateText = referralSlip.date ? new Date(referralSlip.date).toLocaleDateString() : '';
  drawText(dateText, 485, yPos, { size: 10 });
  drawLine(480, yPos + 5, 560, yPos + 5);

  yPos += 20;
  drawText('(Agency)', width / 2 - 20, yPos, { size: 9 });

  // Address
  yPos += 30;
  drawText('Address', 50, yPos, { size: 10 });
  drawText(referralSlip.address || '', 100, yPos, { size: 10 });
  drawLine(90, yPos + 5, 560, yPos + 5);

  // This is to refer to you:
  yPos += 30;
  drawText('This is to refer to you:', 80, yPos, { size: 10 });

  // Name, Age, Sex
  yPos += 30;
  drawText('Name:', 50, yPos, { size: 10 });
  drawText(referralSlip.name || '', 90, yPos, { size: 10 });
  drawLine(85, yPos + 5, 380, yPos + 5);

  drawText('Age:', 390, yPos, { size: 10 });
  drawText(referralSlip.age?.toString() || '', 415, yPos, { size: 10 });
  drawLine(410, yPos + 5, 460, yPos + 5);

  drawText('Sex:', 470, yPos, { size: 10 });
  drawText(referralSlip.sex || '', 495, yPos, { size: 10 });
  drawLine(490, yPos + 5, 560, yPos + 5);

  // Address/School and Grade
  yPos += 20;
  drawText('Address/School:', 50, yPos, { size: 10 });
  drawText(referralSlip.addressOrSchool || '', 130, yPos, { size: 10 });
  drawLine(125, yPos + 5, 380, yPos + 5);

  drawText('Grade:', 390, yPos, { size: 10 });
  drawText(referralSlip.grade || '', 425, yPos, { size: 10 });
  drawLine(420, yPos + 5, 560, yPos + 5);

  // Chief Complaint
  yPos += 25;
  drawText('Chief Complaint:', 50, yPos, { size: 10 });
  drawText(referralSlip.chiefComplaint || '', 50, yPos + 15, { size: 10 });
  drawLine(50, yPos + 20, 560, yPos + 20);

  // Impression
  yPos += 45;
  drawText('Impression:', 50, yPos, { size: 10 });
  drawText(referralSlip.impression || '', 115, yPos, { size: 10 });
  drawLine(110, yPos + 5, 560, yPos + 5);

  // Remarks
  yPos += 15;
  drawText('Remarks:', 50, yPos, { size: 10 });
  drawText(referralSlip.remarks || '', 115, yPos, { size: 10 });
  drawLine(110, yPos + 5, 560, yPos + 5);

  // Name and Signature
  yPos += 30;
  drawText(referralSlip.referrerName || '', 400, yPos, { size: 10 });
  drawLine(380, yPos + 5, 560, yPos + 5);
  drawText('Name and Signature', 420, yPos + 12, { size: 8 });

  drawText('Doctor', 450, yPos + 25, { size: 8 });

  // Designation
  yPos += 25;
  drawText(referralSlip.referrerDesignation || '', 400, yPos, { size: 10 });
  drawLine(380, yPos + 5, 560, yPos + 5);
  drawText('Designation', 440, yPos + 12, { size: 8 });

  // Separator
  yPos += 35;
  drawLine(50, yPos, 560, yPos);
  drawText('Note: To be detached from upper portion and sent back to the school.', 50, yPos + 15, { size: 8 });

  // Return Slip Section
  yPos += 40;
  drawText('Return Slip', width / 2 - 40, yPos, { bold: true, size: 12 });

  if (returnSlip) {
    yPos += 30;
    drawText('Returned to', 50, yPos, { size: 10 });
    drawText(returnSlip.returnedTo || '', 120, yPos, { size: 10 });
    drawLine(115, yPos + 5, 560, yPos + 5);

    yPos += 20;
    drawText('Name of Patient', 50, yPos, { size: 10 });
    drawText(returnSlip.nameOfPatient || '', 140, yPos, { size: 10 });
    drawLine(135, yPos + 5, 380, yPos + 5);

    drawText('Date Referred', 390, yPos, { size: 10 });
    const returnDate = returnSlip.dateReferred ? new Date(returnSlip.dateReferred).toLocaleDateString() : '';
    drawText(returnDate, 465, yPos, { size: 10 });
    drawLine(460, yPos + 5, 560, yPos + 5);

    yPos += 20;
    drawText('Chief Complaint', 50, yPos, { size: 10 });
    drawText(returnSlip.chiefComplaint || '', 140, yPos, { size: 10 });
    drawLine(135, yPos + 5, 560, yPos + 5);

    yPos += 20;
    drawText('Findings', 50, yPos, { size: 10 });
    drawText(returnSlip.findings || '', 115, yPos, { size: 10 });
    drawLine(110, yPos + 5, 560, yPos + 5);

    yPos += 20;
    drawText('Action/Recommendations', 50, yPos, { size: 10 });
    drawText(returnSlip.actionOrRecommendations || '', 185, yPos, { size: 10 });
    drawLine(180, yPos + 5, 560, yPos + 5);

    // Bottom signatures
    yPos += 50;
    drawText(dateText, 50, yPos, { size: 10 });
    drawLine(50, yPos + 5, 150, yPos + 5);
    drawText('Date', 90, yPos + 12, { size: 8 });

    drawText(returnSlip.signatureName || '', 400, yPos, { size: 10 });
    drawLine(380, yPos + 5, 560, yPos + 5);
    drawText('Name & Signature', 430, yPos + 12, { size: 8 });

    yPos += 25;
    drawText(returnSlip.designation || '', 400, yPos, { size: 10 });
    drawLine(380, yPos + 5, 560, yPos + 5);
    drawText('Designation', 440, yPos + 12, { size: 8 });
  }

  const pdfBytes = await pdfDoc.save();

  const fileName = `Referral_Slip_${rsId}_${Date.now()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
  res.setHeader('Content-Length', pdfBytes.length);

  return res.send(Buffer.from(pdfBytes));
});

