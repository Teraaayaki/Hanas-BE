import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import monitorDBChanges from './config/changeStream.js';
import http from 'http';
import cors from 'cors';
// import { Server } from 'socket.io';
// import {
//   addUser,
//   getReceiverSocketInfo,
//   removeUser
// } from './helpers/socket.js';
import verificationRoutes from './routes/verificationRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
dotenv.config();
connectDB();

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
// const io = new Server(server);
monitorDBChanges(server);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).send('Hanas API Working 14/03/22 Soy Leb');
});

app.use('/api/auth', verificationRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/conversations', conversationRoutes);

// io.of('/api/socket').on('connection', (socket) => {
//   socket.on('connected', (userID) => {
//     addUser(userID, socket.id);
//   });

//   socket.on('message', (newMessage, receiverID) => {
//     const receiver = getReceiverSocketInfo(receiverID);

//     io.to(receiver?.socketID).emit('message', newMessage);
//   });

//   socket.on('disconnect', () => {
//     removeUser(socket.id);
//   });
// });

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${port}`)
);
