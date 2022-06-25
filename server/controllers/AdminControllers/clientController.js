import User from "../../models/userModel.js";

import { ObjectId } from "mongodb";

export const getClients = async (req, res) => {
  const clients = await User.aggregate([
    {
      $match: {
        is_verified: true,
        is_worker: false,
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
        address: 1,
        is_verified: 1,
        is_worker: 1,
        createdAt: 1,
      },
    },
    {
      $lookup: {
        from: "verifications",
        localField: "_id",
        foreignField: "user_id",
        as: "verificationData",
        pipeline: [
          {
            $project: {
              verify_status: 1,
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({ clients });
};

export const getClient = async (req, res) => {
  try {
    const client = await User.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
          is_verified: true,
          is_worker: false,
        },
      },
      {
        $project: {
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
          password: 0,
          __v: 0,
        },
      },
      {
        $lookup: {
          from: "verifications",
          localField: "_id",
          foreignField: "user_id",
          as: "verificationData",
          pipeline: [
            {
              $project: {
                valid_id: 1,
                nbi_brgy_clearance: 1,
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({ client });
  } catch (err) {
    console.log(err.message);
  }
};

export const deactivateClient = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { is_deactivated: true },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({
      password: 0,
      __v: 0,
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const activateClient = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { is_deactivated: false },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({
      password: 0,
      __v: 0,
    });
  } catch (err) {
    console.log(err.message);
  }
};
