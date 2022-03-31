import mongoose from "mongoose";

const otpNumberSchema = mongoose.Schema({
  expiresAt: {
    type: Date,
    required: true,
    expires: 10,
  },
  otp: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
    unique: true,
  },
});

export default mongoose.model("OtpNumber", otpNumberSchema);
