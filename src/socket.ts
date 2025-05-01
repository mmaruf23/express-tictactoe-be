import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ClientController } from './controllers';

export function setUpSocket(server: HttpServer) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    const clientId = ClientController.registerClientHandler(socket);
  });
}
