import mongoose from 'mongoose';

const promoAchievedModel = mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    promo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Promo'
    },
    claimed: {
      type: Boolean,
      default: false,
      required: true
    },
    date_claimed: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('PromoAchieved', promoAchievedModel);
