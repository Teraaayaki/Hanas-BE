import mongoose from 'mongoose';

const convFeeTransactionModel = mongoose.Schema(
  {
    transaction_id: {
      type: String,
      unique: true,
      required: true
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    amount_paid: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('ConvFeeTransaction', convFeeTransactionModel);
