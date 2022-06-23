import User from "../../models/userModel.js";
import Report from "../../models/reportModel.js";
import Booking from "../../models/bookingModel.js";

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

export const countIncome = async (req, res) => {
  try{  
    const incomeReport = await Booking.aggregate([
      {$match: {book_status : "Finished"}},
      {
        $group: {
          _id: {$month: "$createdAt"},
          confirmed_income: {$sum: "$conv_fee"}
        }
      },
      {
        $project: {
          Month: {
            $arrayElemAt: [
              ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
              "$_id"
            ]
          },
          confirmed_income: 1,
        }
      },
      {
        $sort: { Month: 1}
      }
    ]);

    return res.status(200).json({ incomeReport });
  }catch(err){
    console.log(err);

  }
};  