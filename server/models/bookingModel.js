import mongoose from "mongoose";

const bookingModel = mongoose.Schema(
  {
    service_availed: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "MyService",
    },
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
    book_type: {
      type: String,
      enum: {
        values: ["Single", "Multiple"],
        message: "{VALUE} is not supported.",
      },
      required: true,
    },
    booked_dateTimeStart: {
      type: Date,
      required: true,
    },
    booked_dateTimeEnd: {
      type: Date,
      required: true,
    },
    date_paid: {
      type: Date,
    },
    total_cost: {
      type: Number,
      required: true,
    },
    total_hours: {
      type: Number,
      required: true,
    },
    book_status: {
      type: String,
      enum: {
        values: ["Ongoing", "Finished", "Accepted", "Pending", "Declined"],
        message: "{VALUE} is not supported.",
      },
      required: true,
    },
    conv_fee: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingModel);
