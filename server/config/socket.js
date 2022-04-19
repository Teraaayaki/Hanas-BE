import {
  addUser,
  getReceiverSocketInfo,
  removeUser
} from '../helpers/socket.js';

const socketConnection = (io) => {
  io.of('/api/socket').on('connection', (socket) => {
    console.log('client connected to socket');

    socket.on('connectToChatroom', (userID) => {
      console.log('user connected to chatroom socket');
      addUser(userID, socket.id);
    });

    socket.on('message', (newMessage, receiverID) => {
      const receiver = getReceiverSocketInfo(receiverID);

      io.of('/api/socket').to(receiver?.socketID).emit('message', newMessage);
    });

    socket.on('disconnectToChatroom', () => {
      console.log('user disconnected to chatroom socket');
      removeUser(socket.id);
    });
  });
};

export default socketConnection;
