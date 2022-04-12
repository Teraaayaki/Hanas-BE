import mongoose from "mongoose";

const feedbackModel = mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    my_service_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "MyService",
    },
    rate: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Feedback", feedbackModel);
