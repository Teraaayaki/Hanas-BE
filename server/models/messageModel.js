import mongoose from 'mongoose';

const messageModel = mongoose.Schema({
  conversation_id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    required: true
  }
});

export default mongoose.model('Message', messageModel);
