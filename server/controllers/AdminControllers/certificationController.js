import MyService from "../../models/myServiceModel.js";

import { ObjectId } from "mongodb";

export const getCertifications = async (req, res) => {
  const certifications = await MyService.aggregate([
    {
      $project: {
        _id: 1,
        worker: 1,
        service: 1,
        updatedAt: 1,
        is_certified: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "worker",
        foreignField: "_id",
        as: "workerData",
        pipeline: [
          {
            $project: {
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
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceData",
        pipeline: [
          {
            $project: {
              service_type: 1,
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({ certifications });
};

export const getCertification = async (req, res) => {
  try {
    const certification = await MyService.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
        },
      },
      {
        $project: {
          sample_works: 0,
          __v: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "worker",
          foreignField: "_id",
          as: "workerData",
          pipeline: [
            {
              $project: {
                password: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceData",
          pipeline: [
            {
              $project: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({ certification });
  } catch (err) {
    console.log(err.message);
  }
};

export const acceptCertification = async (req, res) => {
  try {
    MyService.findOneAndUpdate(
      { _id: req.params.id },
      { is_certified: "Accepted" },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({ sample_works: 0, __v: 0 });
  } catch (err) {
    console.log(err.message);
  }
};

export const rejectCertification = async (req, res) => {
  try {
    MyService.findOneAndUpdate(
      { _id: req.params.id },
      { is_certified: "Rejected" },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({ sample_works: 0, __v: 0 });
  } catch (err) {
    console.log(err.message);
  }
};
