import User from "../../models/userModel.js";

import { ObjectId } from "mongodb";

export const getWorkers = async (req, res) => {
  const workers = await User.aggregate([
    {
      $match: {
        is_verified: true,
        is_worker: true,
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
        is_deactivated: 1,
        is_worker: 1,
        createdAt: 1,
      },
    },
    {
      $lookup: {
        from: "verification",
        localField: "_id",
        foreignField: "user_id",
        as: "verificationData",
        pipeline: [
          {
            $match: {
              verify_status: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "myservices",
        localField: "_id",
        foreignField: "worker",
        as: "myServicesData",
        pipeline: [
          {
            $match: {
              is_certified: true,
            },
          },
          {
            $project: {
              service: 1,
              is_certified: 1,
            },
          },
          {
            $lookup: {
              from: "services",
              localField: "service",
              foreignField: "_id",
              as: "servicesData",
              pipeline: [
                {
                  $project: {
                    service_type: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({ workers });
};

export const getWorker = async (req, res) => {
  try {
    const worker = await User.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
          is_verified: true,
          is_worker: true,
        },
      },
      {
        $project: {
          password: 0,
          __v: 0,
        },
      },
    ]);

    return res.status(200).json({ worker });
  } catch (err) {
    console.log(err.message);
  }
};

export const deactivateWorker = async (req, res) => {
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

export const activateWorker = async (req, res) => {
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
