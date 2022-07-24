import User from "../../models/userModel.js";
import Report from "../../models/reportModel.js";
import Booking from "../../models/bookingModel.js";
import Verification from "../../models/verificationModel.js";

export const countPendingVerifications = async (req, res) => {
  try {
    
    const pendingVerifications = await Verification.find( {verify_status: "Pending"} ).count();

    return res.status(200).json({ pendingVerifications });
  } catch (err) {
    console.log(err.message);
  }
};

export const countUsers = async (req, res) => {
  try {
    const total_users = await User.count();

    return res.status(200).json({ total_users });
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
          income: {$sum: "$conv_fee"}
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
          income: 1,
        }
      },
      {
        $sort: {_id: 1}
      },
    ]);

    return res.status(200).json({ incomeReport });
  }catch(err){
    console.log(err);

  }
};  

export const percentageOfVerified = async (req, res) => {
  try{
    const percentage = await User.aggregate([
      {$match: {is_worker : true}},
      {
        $group:{
          _id: "$is_verified",
          verifiedData: {$count: {}}
        }
      }
    ]);

    return res.status(200).json({ percentageReportOfVerifiedWorkers : percentage})
  }catch(err){
    console.log(err);
  }
};

export const percentageOnTypeOfUsers = async (req, res) => {
  try{
    const percentage = await User.aggregate([
      {
        $group:{
          _id: "$is_worker",
          typeOfUser: {$count: {}}
        }
      }
    ]);

    return res.status(200).json({ percentageReportOfUserTypes : percentage})
  }catch(err){
    console.log(err);
  }
}