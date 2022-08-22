import mongoose from "mongoose";

const convFeeTransactionModel = mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    payments: [
      {
        date: [Date],
        amount: [Number],
      },
    ],
    total_paid: {
      type: Number,
      default: 0.0,
    },
    total_amount: {
      type: Number,
      default: 0.0,
    },
    status: {
      type: String,
      enum: {
        values: ["PAID", "PENDING", "OVERDUE"],
      },
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("ConvFeeTransaction", convFeeTransactionModel);
