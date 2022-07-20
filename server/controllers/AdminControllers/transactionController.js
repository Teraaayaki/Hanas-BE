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

const transactionDefault = async (req, res) => {
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

  return Promise.all(transactions);
};

const sortAscendingHelper = async (sortValue) => {

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
    {
      $sort: {[sortValue]: 1}
    },
    
  ]);

  return Promise.all(transactions);
};

export const sortTransaction = async (req, res) => {

  const choice = req.body.choice;
  switch (choice) {
    case 'all':
      try{
      
        const transactions = await transactionDefault();
      
        return res.status(200).json({ transactions });
    
      } catch( error ){
        console.log(error);
      }

      break;
    case 'cost':
      try{
      
        const transactions = await sortAscendingHelper('total_cost');
      
        return res.status(200).json({ transactions });
    
      } catch( error ){
        console.log(error);
      }

      break;

    case 'date':
      try{
      
        const transactions = await sortAscendingHelper('booked_dateTimeStart');
      
        return res.status(200).json({ transactions });
    
      } catch( error ){
        console.log(error);
      }
      break;
    case 'service':
      try{
      
        const transactions = await sortAscendingHelper('myServiceData.serviceData.service_type');
      
        return res.status(200).json({ transactions });
    
      } catch( error ){
        console.log(error);
      }
      break;
    default:
      break;
  }
};