import User from "../../models/userModel.js";

import { ObjectId } from "mongodb";

//Verifications----------------------------------------
export const getVerifications = async (req, res) => {
  const verifications = await User.aggregate([
    {
      $match: {
        is_verified: false,
      },
    },
    {
      $project: {
        user_id: 1,
        profile_pic: 1,
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
        is_worker: 1,
        is_verified: 1,
        verify_status: 1,
        createdAt: 1,
      },
    },
  ]);

  return res.status(200).json({ verifications });
};

export const getVerification = async (req, res) => {
  try {
    const verification = await User.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
          is_verified: false,
        },
      },
      {
        $project: {
          password: 0,
          __v: 0,
        },
      },
    ]);

    return res.status(200).json({ verification });
  } catch (err) {
    console.log(err.message);
  }
};

export const acceptVerification = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { is_verified: true, verify_status: "Accepted" },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          console.log(updatedRecord);
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({ password: 0, __v: 0 });
  } catch (err) {
    console.log(err.message);
  }
};

export const rejectVerification = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { is_verified: false, verify_status: "Rejected" },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          console.log(updatedRecord);
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({ password: 0, __v: 0 });
  } catch (err) {
    console.log(err.message);
  }
};
