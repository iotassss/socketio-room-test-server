const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

const PORT = 5001;

// クライアントと通信
io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    console.log(roomId);
    socket.join(roomId);
    console.log('a user connected');
  });

  // クライアントからの受信
  socket.on('message', (message) => {
    const user = Array.from(socket.rooms)[0];
    const room = Array.from(socket.rooms)[1];

    console.log('-------------------');
    console.log('user: ' + user);
    console.log('message: ' + message);
    console.log('room: ' + room);
    console.log('-------------------');

    // クライアントへ送信
    io.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
