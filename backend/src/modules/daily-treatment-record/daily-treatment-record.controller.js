import dailyTreatmentRecordService from "./daily-treatment-record.service.js";
import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { extractAuditInfo, getTemplatePath } from "#utils/helpers.js";
import ExcelJS from "exceljs";
import Student from "#modules/student/student.model.js";
import Personnel from "#modules/personnel/personnel.model.js";

export const getDailyCount = asyncHandler(async (req, res) => {
  const count = await dailyTreatmentRecordService.getDailyCount()

  return res.status(StatusCodes.OK).json({
    data: count,
    message: 'Daily count retrieved successfully'
  })
})

export const getDashboardStats = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user)
  const userId = auditInfo.personnelType === 'Doctor' ? null : auditInfo.personnelId;
  const stats = await dailyTreatmentRecordService.getDashboardStats({ userId })

  return res.status(StatusCodes.OK).json({
    data: stats,
    message: 'Dashboard stats retrieved successfully'
  })
})

export const getRecentTreatments = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query
  const auditInfo = extractAuditInfo(req.user)
  const userId = auditInfo.personnelType === 'Doctor' ? null : auditInfo.personnelId;

  const recentTreatments = await dailyTreatmentRecordService.getRecentTreatments(parseInt(limit), userId)
  return res.status(StatusCodes.OK).json({
    data: recentTreatments,
    message: 'Recent treatments retrieved successfully'
  })
})

export const getTreatmentTrendsBySchool = asyncHandler(async (req, res) => {
  const { schoolId, startDate, endDate } = req.query;

  const filters = {};
  if (schoolId) filters.schoolId = schoolId;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const trends = await dailyTreatmentRecordService.getTreatmentTrendsBySchool(filters);

  return res.status(StatusCodes.OK).json({
    data: trends,
    message: 'Treatment trends by school retrieved successfully'
  });
});

export const getTopTreatments = asyncHandler(async (req, res) => {
  const { schoolId, limit, startDate, endDate } = req.query;

  const filters = {};
  if (schoolId) filters.schoolId = schoolId;
  if (limit) filters.limit = parseInt(limit);
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const topTreatments = await dailyTreatmentRecordService.getTopTreatments(filters);

  return res.status(StatusCodes.OK).json({
    data: topTreatments,
    message: 'Top treatments retrieved successfully'
  });
});

export const getTreatmentTimeSeries = asyncHandler(async (req, res) => {
  const { schoolId, startDate, endDate, groupBy } = req.query;

  const filters = {};
  if (schoolId) filters.schoolId = schoolId;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  if (groupBy) filters.groupBy = groupBy;

  const timeSeries = await dailyTreatmentRecordService.getTreatmentTimeSeries(filters);

  return res.status(StatusCodes.OK).json({
    data: timeSeries,
    message: 'Time-series treatment data retrieved successfully'
  });
});

export const getTreatmentAnalyticsDashboard = asyncHandler(async (req, res) => {
  const { schoolId, startDate, endDate } = req.query;

  const filters = {};
  if (schoolId) filters.schoolId = schoolId;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const dashboard = await dailyTreatmentRecordService.getTreatmentAnalyticsDashboard(filters);

  return res.status(StatusCodes.OK).json({
    data: dashboard,
    message: 'Treatment analytics dashboard retrieved successfully'
  });
});


export const compareSchoolTreatmentPatterns = asyncHandler(async (req, res) => {
  const { schoolId, startDate, endDate } = req.body;

  if (!schoolIds || !Array.isArray(schoolIds) || schoolIds.length === 0) {
    throw new ApiError("schoolIds is required", StatusCodes.BAD_REQUEST);
  }
  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const comparison = await dailyTreatmentRecordService.compareSchoolTreatmentPatterns(schoolId, filters);

  return res.status(StatusCodes.OK).json({
    data: comparison,
    message: 'School treatment patterns comparison retrieved successfully'
  });
});

export const getAllRecords = asyncHandler(async (req, res) => {
  const { startDate, endDate, gradeLevel, search, limit } = req.query;
  const auditInfo = extractAuditInfo(req.user)
  const user = auditInfo.personnelType === 'Nurse' ? auditInfo.personnelId : null
  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  if (gradeLevel) filters.gradeLevel = gradeLevel;
  if (search) filters.search = search;
  if (limit) filters.limit = parseInt(limit);
  if (user) filters.attendedBy = user

  const records = await dailyTreatmentRecordService.getAllRecords(filters);

  return res.status(StatusCodes.OK).json({
    records
  });
});
export const deleteRecord = asyncHandler(async (req, res) => {
  const records = await dailyTreatmentRecordService.deleteRecord(req.params.dtrId);

  return res.status(StatusCodes.OK).send('Record Deleted Succesfully')
});

export const exportDailyTreatmentRecord = asyncHandler(async (req, res) => {
  const { startDate, endDate, schoolId } = req.query;
  const auditInfo = extractAuditInfo(req.user)
  const userId = auditInfo.personnelType === 'Nurse' ? auditInfo.personnelId : null

  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  if (schoolId) {
    const schoolRecords = await dailyTreatmentRecordService.getAllRecordsbyId(schoolId);
    if (schoolRecords.length === 0) {
      throw new ApiError(`Selected School: ${schoolId} has no records`, StatusCodes.NOT_FOUND)
    }
    filters.schoolId = schoolId;
  }
  if (userId && auditInfo.personnelType === 'Nurse') {
    filters.attendedBy = userId;
  }

  const records = await dailyTreatmentRecordService.getAllRecords(filters);

  if (!records || records.length === 0) {
    throw new ApiError("No treatment records found for export", StatusCodes.NOT_FOUND);
  }

  // Fetch school information based on schoolId
  let schoolName = "___________________";
  let division = "___________________";
  let region = "___________________";

  if (schoolId) {
    // Try to find school info from Student collection
    const studentWithSchool = await Student.findOne({ schoolId, isDeleted: false })
      .select('schoolName schoolDistrictDivision')
      .lean();

    if (studentWithSchool) {
      schoolName = studentWithSchool.schoolName || schoolName;
      division = studentWithSchool.schoolDistrictDivision || division;
    } else {
      // If not found in Student, try Personnel collection
      const personnelWithSchool = await Personnel.findOne({
        schoolId: { $in: [schoolId] },
        isDeleted: false
      })
        .select('schoolName schoolDistrictDivision')
        .lean();

      if (personnelWithSchool) {
        schoolName = Array.isArray(personnelWithSchool.schoolName) && personnelWithSchool.schoolName.length > 0
          ? personnelWithSchool.schoolName[0]
          : personnelWithSchool.schoolName || schoolName;
        division = Array.isArray(personnelWithSchool.schoolDistrictDivision) && personnelWithSchool.schoolDistrictDivision.length > 0
          ? personnelWithSchool.schoolDistrictDivision[0]
          : personnelWithSchool.schoolDistrictDivision || division;
      }
    }
  } else {
    // If no specific school, try to get from first record
    if (records.length > 0 && records[0].student) {
      schoolName = records[0].student.schoolName || schoolName;
      division = records[0].student.schoolDistrictDivision || division;
    } else if (records.length > 0 && records[0].personnel) {
      schoolName = Array.isArray(records[0].personnel.schoolName) && records[0].personnel.schoolName.length > 0
        ? records[0].personnel.schoolName[0]
        : records[0].personnel.schoolName || schoolName;
      division = Array.isArray(records[0].personnel.schoolDistrictDivision) && records[0].personnel.schoolDistrictDivision.length > 0
        ? records[0].personnel.schoolDistrictDivision[0]
        : records[0].personnel.schoolDistrictDivision || division;
    }
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Daily Treatment Records");

  // Header Section
  sheet.mergeCells("A1:I1");
  sheet.getCell("E1").value = "Republic of the Philippines";
  sheet.getCell("E1").alignment = { horizontal: "center" };
  sheet.getCell("E1").font = { size: 11 };

  sheet.mergeCells("A2:I2");
  sheet.getCell("E2").value = "Department of Education";
  sheet.getCell("E2").alignment = { horizontal: "center" };
  sheet.getCell("E2").font = { size: 11 };

  sheet.mergeCells("A3:I3");
  sheet.getCell("E3").value = `Region ${region}`;
  sheet.getCell("E3").alignment = { horizontal: "center" };
  sheet.getCell("E3").font = { size: 10 };

  sheet.mergeCells("A4:I4");
  sheet.getCell("E4").value = `Division of ${division}`;
  sheet.getCell("E4").alignment = { horizontal: "center" };
  sheet.getCell("E4").font = { size: 10 };

  sheet.mergeCells("A5:I5");
  sheet.getCell("E5").value = schoolId || "___________________";
  sheet.getCell("E5").alignment = { horizontal: "center" };

  sheet.mergeCells("A6:I6");
  sheet.getCell("E6").value = schoolName;
  sheet.getCell("E6").alignment = { horizontal: "center" };
  sheet.getCell("E6").font = { size: 10 };

  // Title
  sheet.mergeCells("A8:I8");
  sheet.getCell("E8").value = "RECORD OF DAILY TREATMENT";
  sheet.getCell("E8").alignment = { horizontal: "center", vertical: "middle" };
  sheet.getCell("E8").font = { bold: true, size: 14 };

  const headerRow = sheet.getRow(10);
  headerRow.values = [
    "Date",
    "Name of Patient",
    "Grade",
    "Chief\nComplaint",
    "Treatment",
    "Attended by",
    "Signature of Patient",
    "Remarks"
  ];

  // Sub-header for Attended by - Row 11
  sheet.getCell("F11").value = "Name";
  sheet.getCell("G11").value = "Designation";

  // Merge cells for headers that span two rows
  sheet.mergeCells("A10:A11");
  sheet.mergeCells("B10:B11");
  sheet.mergeCells("C10:C11");
  sheet.mergeCells("D10:D11");
  sheet.mergeCells("E10:E11");
  sheet.mergeCells("F10:G10"); // Attended by header
  sheet.mergeCells("H10:H11");

  // Style header rows
  [10, 11].forEach(rowNum => {
    const row = sheet.getRow(rowNum);
    row.height = 25;
    row.font = { bold: true, size: 10 };
    row.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

    for (let col = 1; col <= 9; col++) {
      const cell = row.getCell(col);
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  });

  // Set column widths
  sheet.columns = [
    { key: "date", width: 12 },
    { key: "patientName", width: 25 },
    { key: "grade", width: 10 },
    { key: "chiefComplaint", width: 20 },
    { key: "treatment", width: 20 },
    { key: "attendedByName", width: 18 },
    { key: "attendedByDesignation", width: 15 },
    { key: "remarks", width: 18 },
  ];

  // Data rows start from row 12
  let startRow = 12;

  records.forEach((record, index) => {
    const patientName = record.student
      ? `${record.student.firstName || ""} ${record.student.lastName || ""}`.trim()
      : record.personnel
        ? `${record.personnel.firstName || ""} ${record.personnel.lastName || ""}`.trim()
        : record.patientName || "";

    const grade = record.student
      ? record.student.gradeLevel || record.gradeLevel || ""
      : record.personnel?.position || "";

    const attendedByName = record.attendedBy
      ? `${record.attendedBy.firstName || ""} ${record.attendedBy.lastName || ""}`.trim()
      : "";

    const attendedByDesignation = record.attendedBy?.role || "";

    const remarks = record.remarks || record.followUp || "";

    const rowValues = [
      record.dateOfTreatment ? new Date(record.dateOfTreatment).toLocaleDateString() : "",
      patientName,
      grade,
      record.chiefComplaint?.complaint || record.chiefComplaint || "",
      record.treatment || "",
      attendedByName,
      attendedByDesignation,
      remarks,
    ];

    const row = sheet.getRow(startRow + index);
    row.values = rowValues;
    row.height = 30;
    row.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

    for (let col = 1; col <= 9; col++) {
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

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Daily_Treatment_Record_${new Date().toISOString().split("T")[0]}.xlsx`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  await workbook.xlsx.write(res);
  res.end();
});
