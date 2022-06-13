import mongoose from "mongoose";
import { Server } from "socket.io";
import socketConnection from "./socket.js";

import Booking from "../models/bookingModel.js";

const monitorDBChanges = (server) => {
  const io = new Server(server);
  socketConnection(io);

  mongoose.connection.once("open", () => {
    console.log("Connected Change Stream");

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
      .collection('bookings')
      .watch([{ $match: { operationType: 'update' } }], {
        fullDocument: 'updateLookup',
      })
      .on('change', (data) => {
        console.log(data);
      });
  });
};

export default monitorDBChanges;
