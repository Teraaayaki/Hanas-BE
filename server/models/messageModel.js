import mongoose from 'mongoose';

const messageModel = mongoose.Schema(
  {
    message_id: {
      type: String,
      unique: true,
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Message', messageModel);
