import User from "../../models/userModel.js";
import MyService from "../../models/myServiceModel.js";
import Service from "../../models/serviceModel.js";

export const getTopRatedWorkers = async (req, res) => {
  console.log("Address is: ", req.params.address);
  const regEx = new RegExp(`${req.params.address}`);

  let top_rated_workers = await User.aggregate([
    {
      $match: {
        is_worker: true,
        is_verified: true,
        address: { $regex: regEx },
      },
    },
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
              pipeline: [
                {
                  $group: {
                    _id: null,
                    jobs: { $sum: 1 },
                    rateAvg: { $avg: "$rate" },
                  },
                },
              ],
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
        profile_pic: 1,
        feedbackData: 1,
        serviceNameData: 1,
        myServicesData: 1,
      },
    },
  ]);

  // Filter workers with no My Service Data
  // For Further Improvements
  const filtered_top_rated_workers = top_rated_workers.filter(
    (top_rated_workers) => top_rated_workers.myServicesData.length >= 1
  );

  return res.status(200).json({ user: filtered_top_rated_workers });
};

export const getTopServices = async (req, res) => {
  let top_rated_services = await Service.aggregate([
    {
      $lookup: {
        from: "myservices",
        localField: "_id",
        foreignField: "service",
        as: "myServicesData",
      },
    },
    {
      $group: {
        _id: "$_id",
        service_type: { $first: "$service_type" },
        image: { $first: "$image" },
        servicesCount: { $sum: { $size: "$myServicesData" } },
      },
    },
    {
      $match: { servicesCount: { $gt: 0 } },
    },
    { $sort: { servicesCount: -1 } },
    { $limit: 6 },
  ]);

  return res.status(200).json({ top_rated_services });
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

export const getSkilledWorkerWithSpecificService = async (req, res) => {
  console.log("PARAMS", req.params.service_type, req.params.address);

  const { service_type, address } = req.params;
  const regexpAddress = new RegExp(`${address}`);

  const serviceType = await Service.findOne({
    service_type,
  });

  let workers_with_specific_service = await MyService.aggregate([
    { $match: { service: serviceType._id } },
    // { $group : { _id: "$worker", "hourly_rate": {$first: "$hourly_rate"}, "worker" : { $first: "$worker"}, "service_id" : {$first: "$_id"}}}, //ayaw lang ni i delete reference ni para unsaon pag display sa uban values pag mag gamit ug $group
    {
      $lookup: {
        from: "users",
        localField: "worker",
        foreignField: "_id",
        as: "workerDetails",
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
              address: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "feedbacks",
        localField: "_id",
        foreignField: "my_service_id",
        as: "feedbackData",
        pipeline: [
          {
            $group: {
              _id: null,
              jobs: { $sum: 1 },
              rateAvg: { $avg: "$rate" },
            },
          },
        ],
      },
    },
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
      $match: { "workerDetails.address": { $regex: regexpAddress } },
    },
  ]);

  return res
    .status(200)
    .json({ service_worker: workers_with_specific_service });
};

export const getAllServices = async (req, res) => {
  let all_service = await Service.aggregate([
    { $project: { _id: 1, service_id: 1, service_type: 1, image: 1 } },
  ]);

  return res.status(200).json({ all_services: all_service });
};

export const getWorkers = async (req, res) => {
  console.log("Got: ", req.params.keyword, req.params.address);
  const regExpKeyword = new RegExp(`${req.params.keyword}`);
  const regExpAddress = new RegExp(`${req.params.address}`);

  let workers = await MyService.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "worker",
        foreignField: "_id",
        as: "workerDetails",
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
              address: 1,
              is_deactivated: 1,
              is_verified: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "feedbacks",
        localField: "_id",
        foreignField: "my_service_id",
        as: "feedbackData",
        pipeline: [
          {
            $group: {
              _id: null,
              jobs: { $sum: 1 },
              rateAvg: { $avg: "$rate" },
            },
          },
        ],
      },
    },
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
      $project: {
        hourly_rate: 1,
        workerDetails: { $arrayElemAt: ["$workerDetails", 0] },
        feedbackData: 1,
        serviceNameData: { $arrayElemAt: ["$serviceNameData", 0] },
        is_certified: 1,
        keyword: {
          $concat: [
            { $arrayElemAt: ["$workerDetails.name", 0] },
            " ",
            { $arrayElemAt: ["$serviceNameData.service_type", 0] },
          ],
        },
      },
    },
    {
      $match: {
        "workerDetails.address": { $regex: regExpAddress },
        "workerDetails.is_deactivated": false,
        "workerDetails.is_verified": true,
      },
    },
  ]);

  return res.status(200).json({ workers });
};
