import express from 'express'
import { auth } from '#middleware/auth.js'
import validate from '#middleware/validateRequests.js'
import * as dailyTreatmentRecordController from './daily-treatment-record.controller.js'

const router = express.Router()


router.delete('/delete-record/:dtrId', auth('Doctor', 'Admin'), dailyTreatmentRecordController.deleteRecord);
router.get('/analytics/dashboard', auth('Doctor', 'Admin'), dailyTreatmentRecordController.getTreatmentAnalyticsDashboard);

router.get('/trends/by-school', auth('Doctor', 'Admin'), dailyTreatmentRecordController.getTreatmentTrendsBySchool);

router.get('/trends/top-treatments', auth('Doctor', 'Admin'), dailyTreatmentRecordController.getTopTreatments);

router.get('/trends/time-series', auth('Doctor', 'Admin'), dailyTreatmentRecordController.getTreatmentTimeSeries);

router.post('/trends/compare-schools', auth('Doctor', 'Admin'), dailyTreatmentRecordController.compareSchoolTreatmentPatterns);

router.get('/count', auth('Doctor', 'Admin'), dailyTreatmentRecordController.getDailyCount);

router.get('/dashboard', auth('Nurse', 'Doctor', 'Admin'), dailyTreatmentRecordController.getDashboardStats);

router.get('/records', auth('Doctor', 'Admin','Nurse'), dailyTreatmentRecordController.getAllRecords);

router.get('/recent', auth('Nurse', 'Doctor', 'Admin'), dailyTreatmentRecordController.getRecentTreatments);

router.get('/export', auth('Nurse', 'Doctor', 'Admin'), dailyTreatmentRecordController.exportDailyTreatmentRecord)
export default router
