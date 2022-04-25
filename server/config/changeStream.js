import mongoose from 'mongoose';
import { Server } from 'socket.io';
import socketConnection from './socket.js';

const monitorDBChanges = (server) => {
  const io = new Server(server);
  socketConnection(io);

  mongoose.connection.once('open', () => {
    console.log('Connected Change Stream');

    mongoose.connection
      .collection('conversations')
      .watch([{ $match: { operationType: 'update' } }])
      .on('change', (data) => {
        const index = data.updateDescription.updatedFields.__v - 1;
        const newData =
          data.updateDescription.updatedFields[`messages.${index}`];

        io.of('/api/socket').emit('conversationUpdate', newData);
      });
  });
};

export default monitorDBChanges;
