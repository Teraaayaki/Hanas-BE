import mongoose from "mongoose";

const reportModel = mongoose.Schema(
  {
    report_id: {
      type: String,
      unique: true,
      required: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reported_user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    resolved: {
      type: String,
      enum: {
        values: ["Pending", "Resolved", "Rejected"],
        message: "{VALUE} is not supported.",
      },
      required: true,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Report", reportModel);
