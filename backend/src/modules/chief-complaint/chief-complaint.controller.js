import chiefComplaintService from "./chief-complaint.service.js";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import ApiError from "#utils/ApiError.js";
import { extractAuditInfo, getTemplatePath } from '#utils/helpers.js'
import ExcelJS from "exceljs";

export const createChiefComplaint = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);
  if (!req.body.perId) throw new ApiError("Personnel Id is required", StatusCodes.BAD_REQUEST);

  const createdComplaint = await chiefComplaintService.createChiefComplaint({
    ...req.body,
    createdBy: auditInfo.personnelId
  }, req.file);
  return res.status(StatusCodes.CREATED).json({ data: createdComplaint });
});

export const getChiefComplaintById = asyncHandler(async (req, res) => {
  const { perId } = req.params;
  if (!perId) throw new ApiError("Personnel Id is required", StatusCodes.BAD_REQUEST)

  const complaint = await chiefComplaintService.getChiefComplaintById(perId);

  return res.status(StatusCodes.OK).json({ data: complaint });
});

export const updateChiefComplaint = asyncHandler(async (req, res) => {
  const { perId } = req.params;
  const auditInfo = extractAuditInfo(req.user)

  if (!perId) throw new ApiError("Personnel Id is required", StatusCodes.BAD_REQUEST)

  const data = {
    ...req.body,
    createdBy: auditInfo.personnelId
  }

  const updated = await chiefComplaintService.updateChiefComplaint(perId, data, req.file);
  return res.status(StatusCodes.OK).json({ data: updated });
});

export const deleteChiefComplaint = asyncHandler(async (req, res) => {
  const { perId } = req.params;
  if (!perId) throw new ApiError("Personnel Id is required", StatusCodes.BAD_REQUEST)

  const auditInfo = extractAuditInfo(req.user)
  await chiefComplaintService.deleteChiefComplaint(perId, auditInfo.perId);
  return res.status(StatusCodes.NO_CONTENT).send(`Complaint with ${perId} is Deleted`);
});

export const listChiefComplaints = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user)
  const user = auditInfo.personnelType === 'Doctor' ? null : auditInfo.personnelId
  const complaints = await chiefComplaintService.listChiefComplaints(user);
  return res.status(StatusCodes.OK).json({ data: complaints });
});
export const getChiefComplaintByPersonnelName = asyncHandler(async (req, res) => {
  const { personnelName } = req.query;

  if (!personnelName) throw new ApiError("Personnel name is required", StatusCodes.BAD_REQUEST);

  const complaints = await chiefComplaintService.getChiefComplaintByPersonnelName(personnelName);


  return res.status(StatusCodes.OK).json({ data: complaints });
});


export const getComplaintTrendsBySchool = asyncHandler(async (req, res) => {
  const { schoolId, startDate, endDate } = req.query;

  const filters = {};
  if (schoolId) filters.schoolId = schoolId;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const trends = await chiefComplaintService.getComplaintTrendsBySchool(filters);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: trends,
    message: 'Complaint trends by school retrieved successfully'
  });
});

export const getTopCommonComplaints = asyncHandler(async (req, res) => {
  const { schoolId, limit, startDate, endDate } = req.query;

  const filters = {};
  if (schoolId) filters.schoolId = schoolId;
  if (limit) filters.limit = parseInt(limit);
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const topComplaints = await chiefComplaintService.getTopCommonComplaints(filters);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: topComplaints,
    message: 'Top common complaints retrieved successfully'
  });
});


export const getComplaintTimeSeries = asyncHandler(async (req, res) => {
  const { schoolId, startDate, endDate, groupBy } = req.query;

  const filters = {};
  if (schoolId) filters.schoolId = schoolId;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  if (groupBy) filters.groupBy = groupBy;

  const timeSeries = await chiefComplaintService.getComplaintTimeSeries(filters);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: timeSeries,
    message: 'Time-series complaint data retrieved successfully'
  });
});


export const compareSchoolComplaintTrends = asyncHandler(async (req, res) => {
  const { schoolIds, startDate, endDate } = req.body;

  if (!schoolIds || !Array.isArray(schoolIds) || schoolIds.length === 0) {
    throw new ApiError("schoolIds is required", StatusCodes.BAD_REQUEST);
  }

  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const comparison = await chiefComplaintService.compareSchoolComplaintTrends(schoolIds, filters);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: comparison,
    message: 'School complaint trends comparison retrieved successfully'
  });
});

export const getComplaintAnalyticsDashboard = asyncHandler(async (req, res) => {
  const { schoolId, startDate, endDate } = req.query;

  const filters = {};
  if (schoolId) filters.schoolId = schoolId;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const dashboard = await chiefComplaintService.getComplaintAnalyticsDashboard(filters);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: dashboard,
    message: 'Analytics dashboard data retrieved successfully'
  });
});

export const getAutoSchoolComparison = asyncHandler(async (req, res) => {
  const { startDate, endDate, minComplaintsThreshold } = req.query;

  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  if (minComplaintsThreshold) filters.minComplaintsThreshold = parseInt(minComplaintsThreshold);

  const comparison = await chiefComplaintService.getAutoSchoolComparison(filters);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: comparison,
    message: 'Automatic school comparison with insights retrieved successfully'
  });
});

export const exportConsultationAndTreatmentRecord = asyncHandler(async (req, res) => {
  const { startDate, endDate, personnelId, isApproved } = req.query;
  const auditInfo = extractAuditInfo(req.user);

  const user = auditInfo.personnelType === 'Doctor' ? null : auditInfo.personnelId;
  let complaints = await chiefComplaintService.listChiefComplaints(user);

  if (personnelId) {
    complaints = complaints.filter(cc =>
      cc.personnel?._id?.toString() === personnelId ||
      cc.personnel?.toString() === personnelId
    );
  }
  if (startDate) {
    const start = new Date(startDate);
    complaints = complaints.filter(cc => new Date(cc.createdAt) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    complaints = complaints.filter(cc => new Date(cc.createdAt) <= end);
  }
  if (typeof isApproved !== "undefined") {
    const approvedStatus = isApproved === "true";
    complaints = complaints.filter(cc => cc.isApproved === approvedStatus);
  }

  if (!complaints || complaints.length === 0) {
    throw new ApiError("No consultation records found for export", StatusCodes.NOT_FOUND);
  }

  const workbook = new ExcelJS.Workbook();
  const templatePath = getTemplatePath(
    "Consultation and Treatment Record.xlsx"
  );

  let sheet;
  let startRow = 4;

  try {
    await workbook.xlsx.readFile(templatePath);
    sheet = workbook.worksheets[0] || workbook.getWorksheet("Sheet1");
  } catch (err) {
    sheet = workbook.addWorksheet("Consultation and Treatment Record");

    sheet.mergeCells("A1:D1");
    sheet.getCell("A1").value = "CONSULTATION AND TREATMENT RECORD:";
    sheet.getCell("A1").font = { bold: true };
    sheet.getCell("A1").alignment = { horizontal: "left" };


    sheet.getRow(3).values = [
      "Date/Signature of Attending Physician",
      "Chief Complaint",
      "Findings",
      "Treatment/Recommendation",
    ];
    sheet.getRow(3).font = { bold: true };
    sheet.getRow(3).alignment = { horizontal: "center", vertical: "middle" };

    sheet.columns = [
      { key: "dateSignature", width: 40 },
      { key: "complaint", width: 30 },
      { key: "findings", width: 30 },
      { key: "treatment", width: 30 },
    ];

    startRow = 4;
  }

  complaints.forEach((cc, index) => {
    const row = sheet.getRow(startRow + index);

    const date = cc.createdAt
      ? new Date(cc.createdAt).toLocaleDateString()
      : "";

    let doctorName = "";
    if (cc.approvedBy) {
      doctorName = typeof cc.approvedBy === 'object'
        ? `${cc.approvedBy.firstName || ""} ${cc.approvedBy.lastName || ""}`.trim()
        : "";
    } else if (cc.createdBy) {
      doctorName = typeof cc.createdBy === 'object'
        ? `${cc.createdBy.firstName || ""} ${cc.createdBy.lastName || ""}`.trim()
        : "";
    }

    row.getCell("A").value = doctorName ? `${date} / ${doctorName}` : date;

    row.getCell("B").value = cc.complaint || "";
    row.getCell("C").value = cc.findings || "";
    row.getCell("D").value = cc.treatmentOrRecommendation || "";

    row.height = 30;
    row.alignment = { vertical: "top", horizontal: "left", wrapText: true };

    for (let col = 1; col <= 4; col++) {
      const cell = row.getCell(col);
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    row.commit();
  });

  let filename = 'Consultation_and_Treatment_Record';
  if (personnelId && complaints.length > 0) {
    const personnel = complaints[0]?.personnel;
    if (personnel) {
      const personnelName = typeof personnel === 'object'
        ? `${personnel.firstName || ''}_${personnel.lastName || ''}`.trim()
        : '';
      if (personnelName) filename += `_${personnelName.replace(/\s+/g, '_')}`;
    }
  }
  filename += `_${new Date().toISOString().split('T')[0]}.xlsx`;

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${filename}`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  await workbook.xlsx.write(res);
  res.end();
});