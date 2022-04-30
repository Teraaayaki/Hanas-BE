import mongoose from "mongoose";

const bookingModel = mongoose.Schema(
  {
    booking_id: {
      type: String,
      unique: true,
      required: true,
    },
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
    post_date_time: {
      type: Date,
      required: true,
    },
    booked_dateStart: {
      type: Date,
      required: true,
    },
    booked_dateEnd: {
      type: Date,
      required: true,
    },
    booked_timeStart: {
      type: Date,
      required: true,
    },
    booked_timeEnd: {
      type: Date,
      required: true,
    },
    date_paid: {
      type: Date,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    book_status: {
      type: String,
      enum: {
        values: ["On Going", "Finished", "Accepted", "Pending", "Declined"],
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
