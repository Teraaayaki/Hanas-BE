import User from "../../models/userModel.js";
import MyService from "../../models/myServiceModel.js";

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
          $concat: ["$first_name", " ", "$middle_name", " ", "$family_name"],
        },
        feedbackData: 1,
        serviceNameData: 1,
        myServicesData: 1,
      },
    },
  ]);

  return res.status(200).json({ user: top_rated_worker });
};

export const getSkilledWorkerDetails = async (req, res) => {
  let { worker_id, service_id } = req.body;

  const user = await User.findOne({ _id: worker_id });
  const myService = await MyService.findOne({ _id: service_id });
  const workerId = user._id;
  const myServiceId = myService._id;

  let skilled_worker_details = await User.aggregate([
    { $match: { _id: workerId } },
    {
      $lookup: {
        from: "myservices", // other table name
        localField: "_id", // primary key kung asa gikan na table
        foreignField: "worker", // foreign key niya sa other table nga need i join
        as: "myServicesData", // nickname sa results
        pipeline: [
          { $match: { _id: myServiceId } },
          {
            $lookup: {
              from: "feedbacks", // other table name
              localField: "_id", // primary key kung asa gikan na table
              foreignField: "my_service_id", // foreign key niya sa other table nga need i join
              as: "feedbacksData", // nickname sa result
              pipeline: [
                {
                  $lookup: {
                    from: "users",
                    localField: "client",
                    foreignField: "_id",
                    as: "nameData",
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
              ],
            },
          },
          {
            $lookup: {
              from: "bookings",
              localField: "_id",
              foreignField: "service_availed",
              as: "bookingsData",
              pipeline: [
                { $match: { book_status: "Accepted" } }
              ]
            },
          },
        ],
      },
    },
    { $project: { password: 0 } },
  ]);

  return res.status(200).json({ worker_details: skilled_worker_details });
};
