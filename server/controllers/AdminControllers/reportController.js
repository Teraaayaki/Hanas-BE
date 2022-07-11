import Report from "../../models/reportModel.js";

import { ObjectId } from "mongodb";

export const getReportList = async (req, res) => {
  const reportList = await Report.aggregate([
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
              is_worker: 1,
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
              is_worker: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        __v: 0,
      },
    },
  ]);

  return res.status(200).json({ reportList });
};

export const getReport = async (req, res) => {
  try {
    const report = await Report.aggregate([
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
                is_worker: 1,
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
                is_worker: 1,
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({ report });
  } catch (err) {
    console.log(err.message);
  }
};

export const resolveReport = async (req, res) => {
  try {
    Report.findOneAndUpdate(
      { _id: req.params.id },
      { status: "Resolved" },
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
      { status: "Rejected" },
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

export const setPendingReport = async (req, res) => {
  try {
    Report.findOneAndUpdate(
      { _id: req.params.id },
      { status: "Pending" },
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
