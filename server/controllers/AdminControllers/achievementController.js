import Achievement from "../../models/achievementModel.js";
import User from "../../models/userModel.js";

export const addToAchievement = async (req, res) => {
  if (!req.body._id)
    return res.status(422).send({ Error: "Error No data passed" });

  const { item, _id } = req.body;

  try {
    const foundValue = await Achievement.find({ [item]: _id });
    if (foundValue.length != 0) {
      return res.status(422).send({ error: "Achievement has been claimed" });
    } else {
      const updatedValue = await Achievement.updateOne(
        { name: "main" },
        { $push: { [item]: _id } }
      );
      res.status(200).json({ updatedValue });
    }
  } catch (err) {
    console.log(err);
    return res.status(422).send({ Error: "Error inserting data" });
  }
};

export const getAllWorkerList = async (req, res) => {
  try {
    const achievementListData = await User.aggregate([
      { $match: { is_worker: true } },
      {
        $project: {
          _id: 1,
          name: {
            $concat: [
              "$first_name",
              " ",
              "$middle_name",
              " ",
              "$family_name",
              " ",
              "$suffix",
            ],
          },
          updatedAt: 1,
        },
      },
    ]);
    return res.status(200).json({ achievementListData });
  } catch (err) {
    return res.status(422).send("ERROR ENCOUNTERED");
  }
};

export const achievementChecker = async (req, res) => {
  const { id } = req.params;

  try {
    const achievementCheckerResult = await Achievement.aggregate([
      {
        $project: {
          first_item_claimed: { $in: [id, "$first_item_claimed"] },
          second_item_claimed: { $in: [id, "$second_item_claimed"] },
          third_item_claimed: { $in: [id, "$third_item_claimed"] },
          fourth_item_claimed: { $in: [id, "$fourth_item_claimed"] },
          fifth_item_claimed: { $in: [id, "$fifth_item_claimed"] },
          sixth_item_claimed: { $in: [id, "$sixth_item_claimed"] },
        },
      },
    ]);

    return res.status(200).json(achievementCheckerRsesult[0]);
  } catch (error) {
    console.log(error);
    return res.status(422).send("Unable to get results");
  }
};
