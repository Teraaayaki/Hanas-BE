import Achievement from "../../models/achievementModel.js";

export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.findOne(
      { name: "main" },
      { _id: 0, __v: 0 }
    );

    return res.status(200).json(achievements);
  } catch (err) {
    console.log(err);
    return res.status(422).send({ Error: "Cannot get achievements" });
  }
};
