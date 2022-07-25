import mongoose from "mongoose";

const notificationModel = mongoose.Schema(
  {
    causer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    notifiedUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isOpened: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Notification", notificationModel);
