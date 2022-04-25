let connectedUsers = [];

export const addUser = (userID, socketID) => {
  !connectedUsers.some((user) => user.userID === userID) &&
    connectedUsers.push({ userID, socketID });
};

export const getReceiverSocketInfo = (receiverID) => {
  return connectedUsers.find((user) => user.userID === receiverID);
};

export const removeUser = (socketID) => {
  connectedUsers = connectedUsers.filter((user) => user.socketID !== socketID);
};
