import mongoose from 'mongoose';

const conversationModel = mongoose.Schema(
  {
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ],
    messages: [
      {
        text: {
          type: String,
          required: true
        },
        user: {
          _id: {
            type: String,
            required: true
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
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Conversation', conversationModel);
