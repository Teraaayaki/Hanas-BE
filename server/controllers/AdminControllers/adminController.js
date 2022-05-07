import User from "../../models/userModel.js";
import Booking from "../../models/bookingModel.js";
import Report from "../../models/reportModel.js";
import Service from "../../models/serviceModel.js";

// not yet used

//Verifications----------------------------------------
export const getVerifications = async (req, res) => {
  const verifications = await User.find({
    is_verified: false,
  }).select([
    "_id",
    "first_name",
    "middle_name",
    "family_name",
    "suffix",
    "address",
    "updatedAt",
    "is_worker",
    "is_verified",
  ]);

  return res.status(200).json({ verifications });
};

export const getVerification = async (req, res) => {
  try {
    const verification = await User.find({
      _id: req.params.id,
      is_verified: false,
    }).select([
      "_id",
      "first_name",
      "middle_name",
      "family_name",
      "suffix",
      "address",
      "updatedAt",
      "is_worker",
      "is_verified",
    ]);

    return res.status(200).json({ verification });
  } catch (err) {
    console.log(err.message);
  }
};

export const getCertifications = async (req, res) => {
  const certifications = await User.find({
    is_certified: false,
  }).select(["_id", "service_type", "is_certified", "updatedAt"]);

  return res.status(200).json({ verifications });
};

export const getCertification = async (req, res) => {
  try {
    const verification = await User.find({
      _id: req.params.id,
      is_certified: false,
    }).select([
      "_id",
      "service_id",
      "service_type",
      "is_certified",
      "updatedAt",
    ]);

    return res.status(200).json({ verification });
  } catch (err) {
    console.log(err.message);
  }
};

//Clients----------------------------------------
export const getClients = async (req, res) => {
  const clients = await User.find({ is_worker: false }).select([
    "_id",
    "first_name",
    "middle_name",
    "family_name",
    "suffix",
    "address",
    "createdAt",
    "is_worker",
  ]);

  return res.status(200).json({ clients });
};

export const getClient = async (req, res) => {
  try {
    const client = User.find({ _id: req.params.id, isWorker: false });
    return res.status(200).json({ client });
  } catch (err) {
    console.log(err.message);
  }
};

//Skilled Workers----------------------------------------
export const getWorkers = async (req, res) => {
  const workers = await User.aggregate([
    { $match: { is_worker: true } },
    {
      $project: {
        _id: 1,
        first_name: 1,
        middle_name: 1,
        family_name: 1,
        createdAt: 1,
      },
    },
    {
      $lookup: {
        from: "myservices",
        localField: "_id",
        foreignField: "worker",
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

  return res.status(200).json({ workers });
};

export const getWorker = async (req, res) => {
  try {
    const worker = User.find({ _id: req.params.id, isWorker: true });
    return res.status(200).json({ worker });
  } catch (err) {
    console.log(err.message);
  }
};

//Transactions----------------------------------------
export const getTransactions = async (req, res) => {
  const transactions = await Booking.aggregate([
    { $match: { book_status: "Finished" } },
    {
      $project: {
        _id: 1,
        address: 1,
        client: 1,
        worker: 1,
        service_availed: 1,
        total_cost: 1,
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

  return res.status(200).json({ transactions });
};

export const getTransaction = async (req, res) => {
  const transaction = await Booking.aggregate([
    { $match: { _id: req.params.id, book_status: "Finished" } },
  ]);
};

//Reports----------------------------------------
//Still no testable data
export const getReports = async (req, res) => {
  // const reports = await Report.aggregate([
  //   { $match: { book_status: "Finished" } },
  // ]);
  // return res.status(200).json({ reports });
};
