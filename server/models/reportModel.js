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
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    resolved: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Report", reportModel);
