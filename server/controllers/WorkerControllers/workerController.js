import Feedback from "../../models/feedbackModel.js";

export const getFeedback = async (req, res) => {
  let worker_id = req.user._id;

  let feedback = await Feedback.aggregate([
    { $match: { worker: worker_id } },
    {
      $lookup: {
        from: "users",
        localField: "client",
        foreignField: "_id",
        as: "clientNameData",
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
