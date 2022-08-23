import { json } from "express";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

const getDescription = (name, type) => {
  switch (type) {
    case "Message":
      return `${name} sent a new message`;
    case "Booking Requests":
      return `You have a new booking request`;
    case "Accepted Booking Requests":
      return `Your booking request has been accepted`;
    case "Declined Booking Requests":
      return `Your booking request has been declined`;
    case "Service Finished":
      return `${name} has finished the service`;
  }
};

export const createNotification = async (data) => {
  const { causer, notifiedUserID, type, route } = data;

  const causerName = `${causer.first_name} ${causer.family_name}${
    causer.suffix ? ` ${causer.suffix}` : ""
  }`;
  const description = getDescription(causerName, type);

  try {
    Notification.create({
      causer: causer._id,
      notifiedUser: notifiedUserID,
      type,
      route,
      description,
    });

    console.log("Successfully inserted new notif");
  } catch (err) {
    console.log(err.message);
  }
};

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    notifiedUser: req.user._id,
  }).sort({ createdAt: "desc" });

  return res.status(200).json({ notifications });
};

export const changeNotificationStatus = async (req, res) => {
  const response = await Notification.updateOne(
    { _id: req.params.id },
    { isOpened: true }
  );

  if (response.modifiedCount) {
    return res
      .status(200)
      .json({ message: "Notification status successfully udpated" });
  } else {
    return res.status(404).json({ error: "No notification with that ID" });
  }
};

export const registerPushNotifToken = async (req, res) => {
  if (!req.body.token) {
    return res.status(422).send({ error: "No token sent." });
  }

  const { token } = req.body;

  const user = await User.findOne({ _id: req.user._id });

  if (user.push_token === token) {
    return res.status(200).json({ message: "Already registered token" });
  }

  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { push_token: token });

    return res.status(200).json({ message: "Succesfully registered token" });
  } catch (err) {
    console.log(err);
    return res.status(422).send({ error: "error occured" });
  }
};
