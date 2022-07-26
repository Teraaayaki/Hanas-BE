import Booking from "../../models/bookingModel.js";
import { createNotification } from "../notificationController.js";

export const getBookingRequests = async (req, res) => {
  const bookingRequests = await Booking.find({
    worker: req.user._id,
    book_status: "Pending",
  })
    .populate("client", "first_name middle_name family_name suffix address")
    .populate({
      path: "service_availed",
      populate: {
        path: "service",
      },
    })
    .sort({ booked_dateTimeStart: "asc" });

  return res.status(200).json({ bookingRequests });
};

export const acceptBookingRequest = async (req, res) => {
  const bookingRequest = await Booking.findOneAndUpdate(
    { _id: req.params.id },
    { book_status: "Accepted" },
    { new: true },
  );

  if (bookingRequest) {
    createNotification({
      causer: req.user,
      notifiedUserID: bookingRequest.client,
      type: "Accepted Booking Requests",
      route: "Calendar",
    });

    return res.status(200).json({ message: "Booking successfully accecpted" });
  } else {
    return res.status(404).json({ error: "No booking with that ID" });
  }
};

export const declineBookingRequest = async (req, res) => {
  const bookingRequest = await Booking.findOneAndUpdate(
    { _id: req.params.id },
    { book_status: "Declined" },
    { new: true },
  );

  if (bookingRequest) {
    createNotification({
      causer: req.user,
      notifiedUserID: bookingRequest.client,
      type: "Declined Booking Requests",
      route: "Declined/Cancelled",
    });

    return res.status(200).json({ message: "Booking successfully declined" });
  } else {
    return res.status(404).json({ error: "No booking with that ID" });
  }
};
