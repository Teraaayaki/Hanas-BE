import mongoose from "mongoose";

const reportModel = mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reported_user: {
      type: mongoose.Schema.Types.ObjectId,
    },
    concern: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    attached_images: [String],
    status: {
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
