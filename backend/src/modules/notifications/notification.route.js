import express from 'express';
import * as notificationController from './notification.controller.js';
import { auth } from '../../middleware/auth.js';
import validate from '../../middleware/validateRequests.js';
import { personnelRoles } from '#utils/constants.js';

const router = express.Router();


router
  .route('/')
  .get(auth(...personnelRoles), notificationController.getMyNotifications)
  .post(auth('Admin'), notificationController.createNotification);

router
  .route('/unread-count')
  .get(auth(...personnelRoles), notificationController.getUnreadCount);

router
  .route('/health')
  .get(auth('Doctor'), notificationController.getDoctorActivityNotifications);

router
  .route('/read-all')
  .patch(auth(...personnelRoles), notificationController.markAllNotificationsAsRead);

router
  .route('/get-all')
  .patch(auth('Admin', 'Doctor'), notificationController.getAllNotifications);

router
  .route('/:notificationId')
  .delete(auth(...personnelRoles), notificationController.deleteNotification);

router
  .route('/:notificationId/read')
  .patch(auth(...personnelRoles), notificationController.markNotificationAsRead);

export default router;
