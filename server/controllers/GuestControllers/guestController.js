import User from "../../models/userModel.js";
import { ObjectId } from "mongodb";

export const getSkilledWorkerDetails = async (req, res) => {
  let { worker_id, service_id } = req.params;

  let skilled_worker_details = await User.aggregate([
    { $match: { _id: new ObjectId(worker_id) } },
    {
      $lookup: {
        from: "myservices", // other table name
        localField: "_id", // primary key kung asa gikan na table
        foreignField: "worker", // foreign key niya sa other table nga need i join
        as: "myServicesData", // nickname sa results
        pipeline: [
          { $match: { _id: new ObjectId(service_id) } },
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
                          profile_pic: 1,
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
                {
                  $match: {
                    $or: [
                      { book_status: "Accepted" },
                      { book_status: "Ongoing" },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { $project: { password: 0 } },
  ]);

  return res.status(200).json({ worker_details: skilled_worker_details });
};
