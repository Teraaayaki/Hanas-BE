import mongoose from "mongoose";
import { Server } from "socket.io";
import socketConnection from "./socket.js";

import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";

const monitorDBChanges = (server) => {
  const io = new Server(server);
  socketConnection(io);

  mongoose.connection.once("open", () => {
    console.log("Connected to Change Stream");

    mongoose.connection
      .collection("conversations")
      .watch([{ $match: { operationType: "update" } }])
      .on("change", (data) => {
        const index = data.updateDescription.updatedFields.__v - 1;
        const newData = data.updateDescription.updatedFields[`messages.${index}`];

        io.of("/api/socket").emit("conversationUpdate", newData);
      });

    mongoose.connection
      .collection("bookings")
      .watch([{ $match: { operationType: "update" } }])
      .on("change", async (data) => {
        let _id = data.documentKey._id;

        const bookingData = await Booking.findById(_id);

        io.of("/api/socket").emit("clientBookingUpdate", {
          newData: bookingData.client,
        });
      });

    mongoose.connection
      .collection("bookings")
      .watch([{ $match: { operationType: "update" } }], {
        fullDocument: "updateLookup",
      })
      .on("change", (data) => {
        io.of("/api/socket").emit("bookingUpdate", data.fullDocument);
      });

    mongoose.connection
      .collection("bookings")
      .watch([{ $match: { operationType: "insert" } }], {
        fullDocument: "updateLookup",
      })
      .on("change", (data) => {
        io.of("/api/socket").emit("newBooking", data.fullDocument);
      });

    mongoose.connection
      .collection("notifications")
      .watch([{ $match: { operationType: "insert" } }], {
        fullDocument: "updateLookup",
      })
      .on("change", async (data) => {
        const notifiedUser = await User.findById(data.fullDocument.notifiedUser).select(
          "push_token",
        );

        io.of("/api/socket").emit("newNotification", {
          data: data.fullDocument,
          push_token: notifiedUser.push_token,
        });
      });
  });
};

export default monitorDBChanges;
