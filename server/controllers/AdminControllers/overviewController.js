import User from "../../models/userModel.js";
import Report from "../../models/reportModel.js";

export const countPendingVerifications = async (req, res) => {
  const pendingReports = await User.aggregate([
    {
      $match: {
        is_verified: false,
      },
    },
    {
      $group: {
        _id: "_id",
      },
    },
    {
      $count: "Count",
    },
  ]);

  return res.status(200).json({ pendingReports });
};

export const countUsers = async (req, res) => {
  const Users = await User.aggregate([
    {
      $match: {
        is_verified: true,
      },
    },
    {
      $group: {
        _id: "_id",
      },
    },
    {
      $count: "Count",
    },
  ]);

  return res.status(200).json({ Users });
};

export const countPendingReports = async (req, res) => {
  const pendingReports = await Report.aggregate([
    {
      $match: {
        resolved: "Pending",
      },
    },
    {
      $group: {
        _id: "_id",
      },
    },
    {
      $count: "Count",
    },
  ]);

  return res.status(200).json({ pendingReports });
};
