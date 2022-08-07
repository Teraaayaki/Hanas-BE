import Achievement from "../../models/achievementModel.js";
import User from "../../models/userModel.js";
import { ObjectId } from "mongodb";

export const addToAchievement = async (req, res) => {

  if (!req.body._id)
    return res.status(422).send({ Error: "Error No data passed" });

  const { item, _id } = req.body;

  try {
    const foundValue = await Achievement.find({ [item] : _id});
    if(foundValue.length != 0){
      return res.status(422).send({ error: "Achievement has been claimed" });
    }else{
      const updatedValue = await Achievement.updateOne({ name: "main"}, { $push: { [item]: _id } }, );
      res.status(200).json({updatedValue}); 
    }
  } catch (err) {
    console.log(err);
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
