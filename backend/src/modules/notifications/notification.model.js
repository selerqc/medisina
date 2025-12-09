import mongoose from 'mongoose';
import { NOTIFICATION_TYPES, NOTIFICATION_STATUS, PRIORITY_LEVELS } from '#utils/constants.js';
import { generateId } from '#utils/crypto.js';
const notificationSchema = mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(NOTIFICATION_STATUS),
      default: NOTIFICATION_STATUS.UNREAD,
    },
    priority: {
      type: String,
      enum: Object.values(PRIORITY_LEVELS),
      default: PRIORITY_LEVELS.MEDIUM,
    },
    isActionRequired: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false }
  }
);

notificationSchema.pre('save', async function (next) {
  if (!this.isNew) return next()
})
notificationSchema.methods.isExpired = function () {
  return this.expiresAt && this.expiresAt < new Date();
};

notificationSchema.methods.markAsRead = function () {
  this.status = NOTIFICATION_STATUS.READ;
  this.readAt = new Date();
  return this.save();
};

notificationSchema.methods.markAsDeleted = function () {
  this.status = NOTIFICATION_STATUS.DELETED;
  return this.save();
};


notificationSchema.statics.countUnreadByUser = function (userId) {
  const filters = {
    status: NOTIFICATION_STATUS.UNREAD,
  }
  if (userId) {
    filters.ecipientId = userId
  }
  return this.countDocuments(filters);
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification

