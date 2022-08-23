import Booking from "../../models/bookingModel.js";
import ConvFeeTransaction from "../../models/convFeeTransactionModel.js";
import { createNotification } from "../notificationController.js";

const getTotalIncome = (transactions) => {
  return transactions.reduce((total, curr) => {
    return (total += curr.total_cost);
  }, 0);
};

export const getOverviewData = async (req, res) => {
  const thisWeekTransactions = await Booking.find({
    worker: req.user._id,
    book_status: "Finished",
    updatedAt: {
      $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      $lt: new Date(),
    },
  });

  const thisMonthTransactions = await Booking.find({
    worker: req.user._id,
    book_status: "Finished",
    updatedAt: {
      $gte: new Date(new Date().setDate(new Date().getDate() - 31)),
      $lt: new Date(),
    },
  });

  const thisYearTransactions = await Booking.find({
    worker: req.user._id,
    book_status: "Finished",
    updatedAt: {
      $gte: new Date(new Date().setDate(new Date().getDate() - 366)),
      $lt: new Date(),
    },
  });

  const overview = [
    {
      income: getTotalIncome(thisWeekTransactions),
      services: thisWeekTransactions.length,
    },
    {
      income: getTotalIncome(thisMonthTransactions),
      services: thisMonthTransactions.length,
    },

    {
      income: getTotalIncome(thisYearTransactions),
      services: thisYearTransactions.length,
    },
  ];

  return res.status(200).json({ overview });
};

export const getUpcomingServices = async (req, res) => {
  const upcomingServices = await Booking.find({
    worker: req.user._id,
    book_status: "Accepted",
    booked_dateTimeStart: {
      $gt: new Date(),
    },
  })
    .populate("client", "first_name middle_name family_name suffix address")
    .populate({
      path: "service_availed",
      populate: {
        path: "service",
      },
    })
    .sort({ booked_dateTimeStart: "asc" });

  return res.status(200).json({ upcomingServices });
};

export const getOngoingService = async (req, res) => {
  const ongoingService = await Booking.find({
    worker: req.user._id,
    book_status: "Ongoing",
  })
    .populate("client", "first_name middle_name family_name suffix address")
    .populate({
      path: "service_availed",
      populate: {
        path: "service",
      },
    });

  return res.status(200).json({ ongoingService });
};

export const startService = async (req, res) => {
  const ongoingService = await Booking.findOneAndUpdate(
    { _id: req.params.id },
    { book_status: "Ongoing" },
    { new: true }
  );

  return res.status(200).json({ ongoingService });
};

export const serviceFinished = async (req, res) => {
  const serviceFinished = await Booking.findOneAndUpdate(
    { _id: req.params.id },
    { book_status: "Finished" },
    { new: true }
  );

  const workerConvFee = await ConvFeeTransaction.find({
    worker: req.user.id,
  }).select("total_amount");

  console.log(workerConvFee);

  const total_amount =
    workerConvFee[0]?.total_amount === undefined
      ? serviceFinished.conv_fee
      : serviceFinished.conv_fee + workerConvFee[0].total_amount;

  await ConvFeeTransaction.findOneAndUpdate(
    { worker: req.user.id },
    { total_amount },
    { upsert: true }
  );

  if (serviceFinished) {
    createNotification({
      causer: req.user,
      notifiedUserID: serviceFinished.client,
      type: "Service has been finished",
      route: "Calendar",
    });
  }

  return res.status(200).json({ serviceFinished });
};
