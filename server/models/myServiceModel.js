import mongoose from "mongoose";

const myServiceModel = mongoose.Schema(
  {
    my_service_id: {
      type: String,
      unique: true,
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Service",
    },
    hourly_rate: {
      type: Number,
      required: [true, "Please enter your hourly rate."],
      default: 0,
    },
    description: {
      type: String,
    },
    sample_works: [String],
    certificates: [String],
    is_certified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MyService", myServiceModel);
