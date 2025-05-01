import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ClientController, GameController } from './controllers';

export function setUpSocket(server: HttpServer) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    // console.log(`Socket connected: ${socket.id}`);
    /**
     * Buat broadcast aja sih, pake io biar keren. pusing-pusing dah baca kodenya.,
     * @param roomId
     * @param event
     * @param data
     */
    const roomBroadcast = <T>(roomId: string, event: string, data: T) => {
      io.to(roomId).emit(event, data);
    };

    const clientId = ClientController.registerClientHandler(socket);
    GameController.registerGameHandler(socket, clientId, roomBroadcast);
  });
}
