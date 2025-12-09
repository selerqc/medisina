import DentalTreatmentRecord from './dental-treatment-record.model.js';
import ApiError from '#utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
// import cache from '#utils/cache.js';
// import { CACHE_KEYS, CACHE_TTL } from '#utils/cacheKeys.js';
import logger from '#logger/logger.js';
import notificationService from '#modules/notifications/notification.service.js';
import { NOTIFICATION_TITLE, NOTIFICATION_TYPES, PRIORITY_LEVELS } from '#utils/constants.js';

class DentalTreatmentService {

  async getAllRecords() {
    //     const cacheKey = CACHE_KEYS.DENTAL_TREATMENT?.ALL?.() || 'dental_treatment:all';

    //     try {
    //       const cachedData = await cache.get(cacheKey);
    //       if (cachedData) {
    // logger.info(`Cache hit: ${cacheKey}`);
    // return cachedData;
    // }
    // } catch (error) {
    // logger.warn('Cache read error, proceeding with DB query:', error);
    // }

    const records = await DentalTreatmentRecord.find({ isDeleted: false })
      .populate([
        { path: 'student', select: 'firstName lastName stdId schoolName gradeLevel' },
        { path: 'personnel', select: 'firstName lastName perId position' },
        { path: 'attendedBy', select: 'firstName lastName role' },
        { path: 'lastModifiedBy', select: 'firstName lastName role' }
      ])
      .sort({ updatedAt: -1 })
      .lean();

    //     await cache.set(cacheKey, records, CACHE_TTL.MEDIUM);
    return records;
  }

  async getRecordById(id) {
    const record = await DentalTreatmentRecord.findOne({
      $or: [{ _id: id }, { dtrId: id }],
      isDeleted: false
    })
      .populate([
        { path: 'student', select: 'firstName lastName stdId schoolName gradeLevel' },
        { path: 'personnel', select: 'firstName lastName perId position' },
        { path: 'attendedBy', select: 'firstName lastName role' },
        { path: 'lastModifiedBy', select: 'firstName lastName role' }
      ]);

    if (!record) {
      throw new ApiError('Dental treatment record not found', StatusCodes.NOT_FOUND);
    }
    return record;
  }

  async createRecord(recordData) {
    const { patientType, student, personnel, walkIn } = recordData;

    if (patientType === 'student' && !student) {
      throw new ApiError('Student reference is required for student patient type', StatusCodes.BAD_REQUEST);
    }
    if (patientType === 'personnel' && !personnel) {
      throw new ApiError('Personnel reference is required for personnel patient type', StatusCodes.BAD_REQUEST);
    }
    if (patientType === 'walk-in' && (!walkIn || !walkIn.name || !walkIn.age || !walkIn.gender)) {
      throw new ApiError('Walk-in patient details (name, age, gender) are required', StatusCodes.BAD_REQUEST);
    }

    const record = await DentalTreatmentRecord.create(recordData);

    if (recordData.attendedBy) {
      let patientName;
      if (patientType === 'walk-in') {
        patientName = walkIn.name;
      } else {
        patientName = recordData.student
          ? `Student ID: ${recordData.student}`
          : `Personnel ID: ${recordData.personnel}`;
      }

      await notificationService.createNotification({
        recipientId: recordData.attendedBy,
        title: NOTIFICATION_TITLE.DENTAL_TREATMENT_RECORD || 'Dental Treatment Record',
        message: `Dental Treatment Record for ${patientName} has been created`,
        type: NOTIFICATION_TYPES.NEW_RECORD,
        priority: PRIORITY_LEVELS.MEDIUM,
        isActionRequired: false
      });
    }

    //     await cache.delPattern('dental_treatment:*');
    return record;
  }

  async updateRecord(id, updateData) {
    const record = await DentalTreatmentRecord.findOneAndUpdate(
      { $or: [{ _id: id }, { dtrId: id }], isDeleted: false },
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate([
      { path: 'student', select: 'firstName lastName stdId' },
      { path: 'personnel', select: 'firstName lastName perId' },
      { path: 'attendedBy', select: 'firstName lastName role' }
    ]);

    if (!record) {
      throw new ApiError('Dental treatment record not found', StatusCodes.NOT_FOUND);
    }

    if (record.attendedBy) {
      const patientName = record.student
        ? `${record.student.firstName || ''} ${record.student.lastName || ''}`.trim()
        : record.personnel
          ? `${record.personnel.firstName || ''} ${record.personnel.lastName || ''}`.trim()
          : 'Patient';

      await notificationService.createNotification({
        recipientId: record.attendedBy,
        title: NOTIFICATION_TITLE.DENTAL_TREATMENT_RECORD || 'Dental Treatment Record',
        message: `Dental Treatment Record for ${patientName} has been updated`,
        type: NOTIFICATION_TYPES.RECORD_UPDATE,
        priority: PRIORITY_LEVELS.LOW,
        isActionRequired: false
      });
    }

    //     await cache.delPattern('dental_treatment:*');
    return record;
  }

  async deleteRecord(id) {
    const record = await DentalTreatmentRecord.findOneAndUpdate(
      { $or: [{ _id: id }, { dtrId: id }] },
      { isDeleted: true },
      { new: true }
    );

    if (!record) {
      throw new ApiError('Dental treatment record not found', StatusCodes.NOT_FOUND);
    }

    if (record.attendedBy) {
      const patientInfo = record.student
        ? `Student ID: ${record.student}`
        : `Personnel ID: ${record.personnel}`;

      await notificationService.createNotification({
        recipientId: record.attendedBy,
        title: NOTIFICATION_TITLE.DENTAL_TREATMENT_RECORD || 'Dental Treatment Record',
        message: `Dental Treatment Record for ${patientInfo} has been deleted`,
        type: NOTIFICATION_TYPES.RECORD_DELETE,
        priority: PRIORITY_LEVELS.LOW,
        isActionRequired: false
      });
    }

    //     await cache.delPattern('dental_treatment:*');
    return true;
  }

  async addTreatment(id, treatmentData) {
    const record = await DentalTreatmentRecord.findOneAndUpdate(
      { $or: [{ _id: id }, { dtrId: id }], isDeleted: false },
      {
        $push: { treatments: treatmentData },
        $set: { lastModifiedBy: treatmentData.lastModifiedBy }
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'student', select: 'firstName lastName stdId' },
      { path: 'personnel', select: 'firstName lastName perId' },
      { path: 'attendedBy', select: 'firstName lastName role' }
    ]);

    if (!record) {
      throw new ApiError('Dental treatment record not found', StatusCodes.NOT_FOUND);
    }

    //     await cache.delPattern('dental_treatment:*');
    return record;
  }

  async updateTreatment(recordId, treatmentId, treatmentData) {
    const record = await DentalTreatmentRecord.findOne({
      $or: [{ _id: recordId }, { dtrId: recordId }],
      isDeleted: false
    });

    if (!record) {
      throw new ApiError('Dental treatment record not found', StatusCodes.NOT_FOUND);
    }

    const treatment = record.treatments.id(treatmentId);
    if (!treatment) {
      throw new ApiError('Treatment entry not found', StatusCodes.NOT_FOUND);
    }

    Object.assign(treatment, treatmentData);
    if (treatmentData.lastModifiedBy) {
      record.lastModifiedBy = treatmentData.lastModifiedBy;
    }

    await record.save();
    //     await cache.delPattern('dental_treatment:*');

    return record;
  }

  async deleteTreatment(recordId, treatmentId) {
    const record = await DentalTreatmentRecord.findOne({
      $or: [{ _id: recordId }, { dtrId: recordId }],
      isDeleted: false
    });

    if (!record) {
      throw new ApiError('Dental treatment record not found', StatusCodes.NOT_FOUND);
    }

    record.treatments.pull(treatmentId);
    await record.save();
    //     await cache.delPattern('dental_treatment:*');

    return record;
  }

  async getPatientHistory(patientId, patientType = 'student') {
    const query = { isDeleted: false };
    query[patientType] = patientId;

    const records = await DentalTreatmentRecord.find(query)
      .populate([
        { path: 'student', select: 'firstName lastName stdId' },
        { path: 'personnel', select: 'firstName lastName perId' },
        { path: 'attendedBy', select: 'firstName lastName role' }
      ])
      .sort({ updatedAt: -1 })
      .lean();

    return records;
  }

  async getDashboardStats(filters = {}) {
    const { startDate, endDate, schoolId } = filters;

    const matchQuery = { isDeleted: false };

    if (schoolId) {
      matchQuery.schoolId = schoolId;
    }

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const dateRange = {
      start: startDate ? new Date(startDate) : startOfToday,
      end: endDate ? new Date(endDate) : endOfToday
    };

    const totalRecords = await DentalTreatmentRecord.countDocuments(matchQuery);

    const recordsInRange = await DentalTreatmentRecord.countDocuments({
      ...matchQuery,
      'treatments.date': {
        $gte: dateRange.start,
        $lte: dateRange.end
      }
    });

    const totalBalance = await DentalTreatmentRecord.aggregate([
      { $match: matchQuery },
      { $unwind: '$treatments' },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$treatments.balance' },
          totalCharged: { $sum: '$treatments.amountCharged' },
          totalPaid: { $sum: '$treatments.amountPaid' }
        }
      }
    ]);

    const commonProcedures = await DentalTreatmentRecord.aggregate([
      { $match: matchQuery },
      { $unwind: '$treatments' },
      {
        $group: {
          _id: '$treatments.procedure',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return {
      totalRecords,
      recordsInRange,
      financials: totalBalance[0] || { totalBalance: 0, totalCharged: 0, totalPaid: 0 },
      commonProcedures: commonProcedures.map(p => ({ procedure: p._id, count: p.count })),
      dateRange
    };
  }
}

export default new DentalTreatmentService();
