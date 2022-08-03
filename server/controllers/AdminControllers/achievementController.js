import Achievement from "../../models/achievementModel.js";
import User from "../../models/userModel.js";
import { ObjectId } from "mongodb";

export const addToAchievement = async (req, res) => {

  if (!req.body._id)
    return res.status(422).send({ Error: "Error No data passed" });

  const { item, _id } = req.body;

  try {
    await Achievement.updateOne({ name: "main", [item]: _id }, { upsert: true });

    res.status(200).json({ message: "Successfully claimed achievement" });
  } catch (err) {
    // console.log(err);
    return res.status(422).send({ Error: "Error inserting data" });
  }
};

export const getAllWorkerList = async (req, res) => {

  try{
    const achievementListData = await User.aggregate([
      {$match: {is_worker: true}},
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
    return res.status(200).json({achievementListData});
  }catch (err){
    return res.status(422).send("ERROR ENCOUNTERED");
  }

};
