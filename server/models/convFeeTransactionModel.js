import mongoose from 'mongoose';

const convFeeTransactionModel = mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    payments: [{
      date : [Date],
      amount : [Number]
    }],
    total_paid:{
      type: Number,
    },
    total_amount: {
      type: Number,
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model('ConvFeeTransaction', convFeeTransactionModel);
