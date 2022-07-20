import Achievement from "../../models/achievementModel.js";

const claimedAchievement = (achievementArray, user_id) => {
  return achievementArray.includes(user_id);
};

const getAllClaimedAchievements = (achievements, user_id) => {
  const first_item_claimed = claimedAchievement(
    achievements.first_item_claimed,
    user_id
  );
  const second_item_claimed = claimedAchievement(
    achievements.second_item_claimed,
    user_id
  );
  const third_item_claimed = claimedAchievement(
    achievements.third_item_claimed,
    user_id
  );
  const fourth_item_claimed = claimedAchievement(
    achievements.fourth_item_claimed,
    user_id
  );
  const fifth_item_claimed = claimedAchievement(
    achievements.fifth_item_claimed,
    user_id
  );
  const sixth_item_claimed = claimedAchievement(
    achievements.sixth_item_claimed,
    user_id
  );

  return {
    first_item_claimed,
    second_item_claimed,
    third_item_claimed,
    fourth_item_claimed,
    fifth_item_claimed,
    sixth_item_claimed,
  };
};

export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.findOne(
      { name: "main" },
      { _id: 0, __v: 0, name: 0 }
    );

    const claimedAchievements = getAllClaimedAchievements(
      achievements,
      `${req.user._id}`
    );

    return res.status(200).json(claimedAchievements);
  } catch (err) {
    // console.log("Achievements error",err);
    return res.status(422).send({ Error: "Cannot get achievements" });
  }
};
