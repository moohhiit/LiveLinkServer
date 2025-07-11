import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: '*',methods: ['GET', 'POST'] },
  });
  console.log("Socket Trigard")
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export const getSocket = () => {
  if (!io) throw new Error('Socket.io not Working');
  return io;
};
