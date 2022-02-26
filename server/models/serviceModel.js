import mongoose from 'mongoose';

const serviceSchema = mongoose.Schema(
  {
    service_id: {
      type: String,
      unique: true,
      required: true
    },
    service_type: {
      type: String,
      unique: true,
      required: [true, 'Please enter the type of service.']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Service', serviceSchema);
