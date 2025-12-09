import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import ApiError from '../../utils/ApiError.js';
import notificationService from './notification.service.js';
import { extractAuditInfo } from '#utils/helpers.js';



export const getDoctorActivityNotifications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'Doctor') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied. Only doctors can view activity notifications.');
  }

  const filters = {

    activityType: req.query.activityType,
    limit: req.query.limit ? parseInt(req.query.limit) : 50,

  };

  const result = await notificationService.getDoctorActivityNotifications(filters);

  return res.status(StatusCodes.OK).json({
    data: result
  });
});


export const createNotification = asyncHandler(async (req, res) => {
  const recipientId = extractAuditInfo(req.user)
  const notificationBody = {
    recipientId: recipientId.personnelId,
    ...req.body
  }
  const notification = await notificationService.createNotification(notificationBody);
  return res.status(StatusCodes.CREATED).json(notification);
});

export const getMyNotifications = asyncHandler(async (req, res) => {
  const recipientId = extractAuditInfo(req.user)
  const result = await notificationService.getMyNotifications(recipientId.personnelId.toString());
  return res.status(StatusCodes.OK).json({ result });
});
export const getAllNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getAllNotifications();
  return res.status(StatusCodes.OK).json({ result });
});


export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.notificationId);
  if (!notification) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found');
  }

  const updatedNotification = await notificationService.markAsRead(req.params.notificationId);
  return res.json(updatedNotification);
});

export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const recipientId = extractAuditInfo(req.user)
  const result = await notificationService.markAllAsRead(recipientId.personnelId.toString());
  return res.json(result);
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.notificationId);
  if (!notification) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found');
  }

  await notificationService.deleteNotification(req.params.notificationId);
  return res.status(StatusCodes.NO_CONTENT).json();
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const recipientId = extractAuditInfo(req.user)
  const user = recipientId.personnelType === 'Doctor' || recipientId.personnelType === 'Admin' ? null : recipientId.personnelId
  const count = await notificationService.getUnreadCount(user);
  return res.status(StatusCodes.OK).json({ count });
});
