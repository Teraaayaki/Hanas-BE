import Report from "../../models/reportModel.js";

import { ObjectId } from "mongodb";

export const getReports = async (req, res) => {
  const reports = await Report.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "reporter",
        foreignField: "_id",
        as: "reporterData",
        pipeline: [
          {
            $project: {
              profile_pic: 1,
              first_name: 1,
              middle_name: 1,
              family_name: 1,
              suffix: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reported_user",
        foreignField: "_id",
        as: "reportedUserData",
        pipeline: [
          {
            $project: {
              profile_pic: 1,
              first_name: 1,
              middle_name: 1,
              family_name: 1,
              suffix: 1,
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({ reports });
};

export const getReport = async (req, res) => {
  try {
    const reports = await Report.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reporter",
          foreignField: "_id",
          as: "reporterData",
          pipeline: [
            {
              $project: {
                profile_pic: 1,
                first_name: 1,
                middle_name: 1,
                family_name: 1,
                suffix: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reported_user",
          foreignField: "_id",
          as: "reportedUserData",
          pipeline: [
            {
              $project: {
                profile_pic: 1,
                first_name: 1,
                middle_name: 1,
                family_name: 1,
                suffix: 1,
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({ reports });
  } catch (err) {
    console.log(err.message);
  }
};

export const resolveReport = async (req, res) => {
  try {
    Report.findOneAndUpdate(
      { _id: req.params.id },
      { resolved: "Resolved" },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({ __v: 0 });
  } catch (err) {
    console.log(err.message);
  }
};

export const rejectReport = async (req, res) => {
  try {
    Report.findOneAndUpdate(
      { _id: req.params.id },
      { resolved: "Rejected" },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({ __v: 0 });
  } catch (err) {
    console.log(err.message);
  }
};
