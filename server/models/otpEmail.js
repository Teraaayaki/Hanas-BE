import mongoose from "mongoose";

const otpEmailSchema = mongoose.Schema({
  expiresAt: {
    type: Date,
    required: true,
    expires: 300,
  },
  otp: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model("OtpEmail", otpEmailSchema);
