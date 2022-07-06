import Achievement from "../../models/achievementModel.js";

export const addToAchievement = async (req, res) => {
  if (!req.body.user_id)
    return res.status(422).send({ Error: "Error No data passed" });

  const { item, user_id } = req.body;

  try {
    await Achievement.updateOne({ name: "main", [item]: user_id });

    res.status(200).json({ message: "Successfully claimed achievement" });
  } catch (err) {
    console.log(err);
    return res.status(422).send({ Error: "Error inserting data" });
  }
};
