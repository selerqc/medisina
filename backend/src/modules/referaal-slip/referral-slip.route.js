import express from "express";
import { auth } from "#middleware/auth.js";
import validate from '#middleware/validateRequests.js';
import * as referralSlipController from "./referral-slip.controller.js";
import {
  createReferralSlipSchema, updateReferralSlipSchema, updateReturnSlipSchema, getReferralSlipByIdSchema, bulkDeleteSchema, searchQuerySchema, dateRangeQuerySchema, referrerNameParamSchema
} from "./referral-slip.validation.js";

const router = express.Router();

router.route('/')
  .post(auth('Doctor', 'Admin', 'Nurse'), validate({ body: createReferralSlipSchema }), referralSlipController.createReferralSlip)
  .get(auth('Admin', 'Doctor'), referralSlipController.fetchAllReferralSlips);

router.route('/user-records')
  .get(auth('Doctor', 'Admin', 'Nurse'), referralSlipController.fetchUserReferralSlips);

router.route('/search')
  .get(auth('Doctor', 'Admin', 'Nurse'), validate({ query: searchQuerySchema }), referralSlipController.searchByPatientName);

router.route('/stats/count')
  .get(auth('Doctor', 'Admin', 'Nurse'), referralSlipController.getReferralSlipCount);

router.route('/pending-returns')
  .get(auth('Doctor', 'Admin', 'Nurse'), referralSlipController.getPendingReturnSlips);

router.route('/completed')
  .get(auth('Doctor', 'Admin', 'Nurse'), referralSlipController.getCompletedReferrals);

router.route('/date-range')
  .get(auth('Doctor', 'Admin', 'Nurse'), validate({ query: dateRangeQuerySchema }), referralSlipController.getRecordsByDateRange);


router.route('/referrer/:referrerName')
  .get(auth('Doctor', 'Admin', 'Nurse'), validate({ params: referrerNameParamSchema }), referralSlipController.getReferralsByReferrer);

router.route('/:rsId/export')
  .get(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getReferralSlipByIdSchema }), referralSlipController.exportReferralSlipToExcel);

router.route('/bulk')
  .delete(auth('Doctor', 'Admin', 'Nurse'), validate({ body: bulkDeleteSchema }), referralSlipController.bulkDeleteReferralSlips);

router.route('/:rsId')
  .get(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getReferralSlipByIdSchema }), referralSlipController.getReferralSlipById)
  .put(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getReferralSlipByIdSchema, body: updateReferralSlipSchema }), referralSlipController.updateReferralSlipById).patch(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getReferralSlipByIdSchema, body: updateReferralSlipSchema }), referralSlipController.updateReferralSlipById)
  .delete(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getReferralSlipByIdSchema }), referralSlipController.deleteReferralSlipById);

router.route('/:rsId/restore')
  .post(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getReferralSlipByIdSchema }), referralSlipController.restoreReferralSlip);

router.route('/:rsId/return-slip')
  .put(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getReferralSlipByIdSchema, body: updateReturnSlipSchema }), referralSlipController.updateReturnSlip).patch(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getReferralSlipByIdSchema, body: updateReturnSlipSchema }), referralSlipController.updateReturnSlip);

export default router;
