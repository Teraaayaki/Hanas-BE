import mongoose from 'mongoose';

const sampleWorkModel = mongoose.Schema(
  {
    certificate_id: {
      type: String,
      unique: true,
      required: true
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    image: {
      type: String,
      required: [true, 'Please provide an image of your sample work.']
    },
    description: {
      type: String
    },
    is_certified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('SampleWork', sampleWorkModel);
