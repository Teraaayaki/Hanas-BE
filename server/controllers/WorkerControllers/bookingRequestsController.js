import Booking from "../../models/bookingModel.js";

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
  const response = await Booking.updateOne(
    { _id: req.params.id },
    { book_status: "Accepted" },
  );

  if (response.modifiedCount) {
    console.log("accepted booking");
    return res.status(200).json({ message: "Booking successfully accecpted" });
  } else {
    console.log("no booking");
    return res.status(404).json({ error: "No booking with that ID" });
  }
};

export const declineBookingRequest = async (req, res) => {
  const response = await Booking.updateOne(
    { _id: req.params.id },
    { book_status: "Declined" },
  );

  if (response.modifiedCount) {
    return res.status(200).json({ message: "Booking successfully declined" });
  } else {
    return res.status(404).json({ error: "No booking with that ID" });
  }
};
