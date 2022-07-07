import mongoose from "mongoose";

const achievementModel = mongoose.Schema({
  name: { type: String, required: true },
  first_item_claimed: [String],
  second_item_claimed: [String],
  third_item_claimed: [String],
  fourth_item_claimed: [String],
  fifth_item_claimed: [String],
  sixth_item_claimed: [String],
});

export default mongoose.model("Achievement", achievementModel);
