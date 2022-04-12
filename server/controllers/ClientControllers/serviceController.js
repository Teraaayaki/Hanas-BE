import User from "../../models/userModel.js";

export const getTopRatedWorkers = async (req, res) => {
  let top_rated_worker = await User.aggregate([
    { $match: { is_worker: true, is_verified: true } },
    {
      $lookup: {
        from: "myservices", // other table name
        localField: "_id", // primary key kung asa gikan na table
        foreignField: "worker", // foreign key niya sa other table nga need i join
        as: "myServicesData", // nickname sa results
        pipeline: [
          {
            $lookup: {
              from: "services",
              localField: "service",
              foreignField: "_id",
              as: "serviceNameData",
              pipeline: [{ $project: { service_type: 1 } }],
            },
          },
          {
            $lookup: {
              from: "feedbacks",
              localField: "_id",
              foreignField: "my_service_id",
              as: "feedbackData",
              pipeline: [{ $group: { _id: null, rateAvg: { $avg: "$rate" } } }],
            },
          },
        ],
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
          ],
        },
        feedbackData: 1,
        serviceNameData: 1,
        myServicesData: 1,
      },
    },
  ]);

  return res.status(200).json({ user: top_rated_worker });
};
