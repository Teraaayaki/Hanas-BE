import mongoose from 'mongoose';

const notificationModel = mongoose.Schema(
  {
    notification_id: {
      type: String,
      unique: true,
      required: true
    },
    causer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    notifiedUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    type: {
      type: String,
      required: true
    },
    URL: {
      type: String,
      required: true
    },
    description: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Notification', notificationModel);
