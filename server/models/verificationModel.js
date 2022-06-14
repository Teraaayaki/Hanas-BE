import mongoose from "mongoose";

const verificationSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true,
            required: true,
          },
        valid_id: [String],
        nbi_brgy_clearance: [String],
    },
    {
        timestamps: true,
    }
)

export default mongoose.model("Verification", verificationSchema);
