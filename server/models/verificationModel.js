import mongoose from "mongoose";

const verificationSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    valid_id: [String],
    nbi_brgy_clearance: [String],
    is_removed: {
      type: Boolean,
      default: false,
    },
    verify_status: {
      type: String,
      enum: {
        values: ["Pending", "Accepted", "Rejected"],
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

export default mongoose.model("Verification", verificationSchema);
