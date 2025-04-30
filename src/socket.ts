import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export function setUpSocket(server: HttpServer) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
