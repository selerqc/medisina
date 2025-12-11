import personnelService from './personnel.service.js';
import { StatusCodes } from 'http-status-codes';
import ApiError from '#utils/ApiError.js';
import asyncHandler from 'express-async-handler';
import { extractAuditInfo, getFileTypeFromMimeType } from '#utils/helpers.js';
import logger from '#logger/logger.js';

export const getPendingApprovals = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const auditInfo = extractAuditInfo(req.user);

  logger.info(`Fetching pending personnel approvals - Page: ${page}, Limit: ${limit}`, auditInfo);

  const pendingRecords = await personnelService.getHealthRecordsForApproval(page, limit);

  return res.status(StatusCodes.OK).json({
    data: pendingRecords
  });
});

export const getApprovedRecords = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const auditInfo = extractAuditInfo(req.user);


  const approvedRecords = await personnelService.getApprovedHealthRecords(page, limit);

  return res.status(StatusCodes.OK).json({
    data: approvedRecords
  });
});


export const approvePersonnelHealthRecord = asyncHandler(async (req, res) => {
  const { perId } = req.params;
  const { treatment = "", remarks = "", fileName, fileSize, mimeType } = req.body;
  const doctorId = extractAuditInfo(req.user);

  if (!perId) throw new ApiError('Record ID is required', StatusCodes.BAD_REQUEST);

  const file = req.file;
  let fileMetadata = null;

  if (file) {
    const fileMimeType = mimeType || file.mimetype;
    const actualFileType = getFileTypeFromMimeType(fileMimeType);

    fileMetadata = {
      fileName: fileName || file.originalname,
      fileType: actualFileType,
      fileSize: fileSize || file.size,
      mimeType: fileMimeType
    };
  }

  const approvedRecord = await personnelService.approvePersonnelHealthRecord(
    perId,
    doctorId.personnelId,
    treatment,
    remarks,
    file,
    fileMetadata
  );

  return res.status(StatusCodes.OK).json({
    message: 'Personnel health record approved successfully',
    data: approvedRecord
  });
});

export const approveSchoolHealthRecord = asyncHandler(async (req, res) => {
  const { stdId } = req.params;
  const { treatment = "", remarks = "", gradeLevel, fileName, fileSize, mimeType } = req.body;
  const doctorId = extractAuditInfo(req.user);



  if (!stdId) throw new ApiError('Record ID is required', StatusCodes.BAD_REQUEST);
  if (!gradeLevel) throw new ApiError('Grade level is required', StatusCodes.BAD_REQUEST);

  const file = req.file;
  let fileMetadata = null;

  if (file) {
    const fileMimeType = mimeType || file.mimetype;
    const actualFileType = getFileTypeFromMimeType(fileMimeType);

    fileMetadata = {
      fileName: fileName || file.originalname,
      fileType: actualFileType,
      fileSize: fileSize || file.size,
      mimeType: fileMimeType
    };
  }

  const approvedRecord = await personnelService.approveSchoolHealthRecord(
    stdId,
    gradeLevel,
    doctorId.personnelId,
    treatment,
    remarks,
    file,
    fileMetadata
  );

  return res.status(StatusCodes.OK).json({
    message: 'School health record approved successfully',
    data: approvedRecord
  });
}); export const approveChiefComplaint = asyncHandler(async (req, res) => {
  const { perId } = req.params;
  const { treatment = "", remarks = "", fileName, fileSize, mimeType } = req.body;
  const doctorId = extractAuditInfo(req.user);

  if (!perId) throw new ApiError('Record ID is required', StatusCodes.BAD_REQUEST);

  const file = req.file;
  let fileMetadata = null;

  if (file) {
    const fileMimeType = mimeType || file.mimetype;
    const actualFileType = getFileTypeFromMimeType(fileMimeType);

    fileMetadata = {
      fileName: fileName || file.originalname,
      fileType: actualFileType,
      fileSize: fileSize || file.size,
      mimeType: fileMimeType
    };
  }

  const approvedRecord = await personnelService.approveChiefComplaint(
    perId,
    doctorId.personnelId,
    treatment,
    remarks,
    file,
    fileMetadata
  );

  return res.status(StatusCodes.OK).json({
    message: 'Chief complaint approved successfully',
    data: approvedRecord
  });
});