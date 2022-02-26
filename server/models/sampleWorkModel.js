import mongoose from 'mongoose';

const sampleWorkModel = mongoose.Schema(
  {
    sample_work_id: {
      type: String,
      unique: true,
      required: true
    },
    my_service: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'MyService'
    },
    image: {
      type: String,
      required: [true, 'Please provide an image of your sample work.']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('SampleWork', sampleWorkModel);
