import Feedback from "../../models/feedbackModel.js";

export const bookWorker = async (req, res) => {};

export const getFeedback = async (req, res) => {
  let client_id = req.user._id;

  let feedback = await Feedback.aggregate([
    { $match: { client: client_id } },
    {
      $lookup: {
        from: "users",
        localField: "worker",
        foreignField: "_id",
        as: "workerNameData",
        pipeline: [
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
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "myservices",
        localField: "my_service_id",
        foreignField: "_id",
        as: "myServicesData",
        pipeline: [
          {
            $lookup: {
              from: "services",
              localField: "service",
              foreignField: "_id",
              as: "ServiceNameData",
              pipeline: [{ $project: { service_type: 1 } }],
            },
          },
          {
            $project: {
              hourly_rate: 1,
              ServiceNameData: 1,
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({ feedback });
};
