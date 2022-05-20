import User from "../../models/userModel.js";
import Report from "../../models/reportModel.js";

export const countPendingVerifications = async (req, res) => {
  try {
    const pendingVerifications = await User.aggregate([
      {
        $match: {
          is_verified: false,
        },
      },
      {
        $group: {
          _id: "$_id",
        },
      },
      {
        $count: "Count",
      },
    ]);

    return res.status(200).json({ pendingVerifications });
  } catch (err) {
    console.log(err.message);
  }
};

export const countUsers = async (req, res) => {
  try {
    const Users = await User.aggregate([
      {
        $match: {
          is_verified: true,
        },
      },
      {
        $group: {
          _id: "$_id",
        },
      },
      {
        $count: "Count",
      },
    ]);

    return res.status(200).json({ Users });
  } catch (err) {
    console.log(err.message);
  }
};

export const countPendingReports = async (req, res) => {
  try {
    const pendingReports = await Report.aggregate([
      {
        $match: {
          resolved: "Pending",
        },
      },
      {
        $group: {
          _id: "$_id",
        },
      },
      {
        $count: "Count",
      },
    ]);

    return res.status(200).json({ pendingReports });
  } catch (err) {
    console.log(err.message);
  }
};
