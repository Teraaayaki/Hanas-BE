import Booking from "../../models/bookingModel.js";

import { ObjectId } from "mongodb";

export const getTransactions = async (req, res) => {
  const transactions = await Booking.aggregate([
    { $match: { book_status: "Finished" } },
    {
      $project: {
        _id: 1,
        client: 1,
        worker: 1,
        service_availed: 1,
        address: 1,
        total_cost: 1,
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

export const getSpecificTransaction = async (req, res) => {
  try {
    const transaction = await Booking.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
          book_status: "Finished",
        },
      },
      {
        $project: {
          isRemovedClient: 0,
          isRemovedWorker: 0,
          __v: 0,
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
    ]);

    return res.status(200).json({ transaction });
  } catch (err) {
    console.log(err.message);
  }
};
