import mongoose from 'mongoose';

const promoModel = mongoose.Schema(
  {
    promo_id: {
      type: String,
      unique: true,
      required: true
    },
    evenDesc: {
      type: String,
      required: true
    },
    salesRequired: {
      type: Number,
      required: true
    },
    rewardDesc: {
      type: String,
      required: true
    },
    start_dateTime: {
      type: Date,
      required: true
    },
    end_dateTime: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Promo', promoModel);
