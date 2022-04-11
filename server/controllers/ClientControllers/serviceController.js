import User from "../../models/userModel.js";

export const getTopRatedWorkers = async (req, res) => {
  let top_rated_worker = await await User.aggregate([
    { $match: { is_worker: true } },
    {
      $lookup: {
        from: "myservices", // other table name
        localField: "_id", // primary key kung asa gikan na table
        foreignField: "worker", // foreign key niya sa other table nga need i join
        as: "MyServicesData", // nickname sa results
        pipeline: [
          {
            $lookup: {
              from: "services",
              localField: "service",
              foreignField: "_id",
              as: "ServiceNameData",
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "feedbacks",
        localField: "_id",
        foreignField: "worker",
        as: "FeedbackData",
      },
    },
    { $project: { password: 0 } },
  ]);

  return res.status(200).json({ user: top_rated_worker });
};
