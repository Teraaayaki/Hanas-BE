import mongoose from 'mongoose';

const feedbackModel = mongoose.Schema(
  {
    feedback_id: {
      type: String,
      unique: true,
      required: true
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    rate: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Feedback', feedbackModel);
