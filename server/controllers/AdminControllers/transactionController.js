import Booking from "../../models/bookingModel.js";

import { ObjectId } from "mongodb";

export const getTransactions = async (req, res) => {
  const transactions = await Booking.aggregate([
    { $match: { $or: [ { book_status: "Finished" }, {book_status: "Ongoing"}] } },
    {
      $project: {
        __v: 0,
        isFeedbacked: 0,
        isRemovedClient: 0,
        isRemovedWorker: 0,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "client",
        foreignField: "_id",
        as: "clientData",
        pipeline: [
          {
            $project: {
              first_name: 1,
              middle_name: 1,
              family_name: 1,
              address: 1,
            },
          },
        ],
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
              first_name: 1,
              middle_name: 1,
              family_name: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "myservices",
        localField: "service_availed",
        foreignField: "_id",
        as: "myServiceData",
        pipeline: [
          {
            $project: {
              service: 1,
              hourly_rate: 1,
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
        ],
      },
    },
  ]);

  return res.status(200).json({ transactions });
};