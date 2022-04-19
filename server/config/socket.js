import {
  addUser,
  getReceiverSocketInfo,
  removeUser
} from '../helpers/socket.js';

const socketConnection = (io) => {
  io.of('/api/socket').on('connection', (socket) => {
    socket.on('connected', (userID) => {
      console.log('connected');
      addUser(userID, socket.id);
    });

    socket.on('message', (newMessage, receiverID) => {
      const receiver = getReceiverSocketInfo(receiverID);

      io.of('/api/socket').to(receiver?.socketID).emit('message', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
      removeUser(socket.id);
    });
  });
};

export default socketConnection;
