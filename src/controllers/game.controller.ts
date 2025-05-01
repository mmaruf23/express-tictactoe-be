import { TileValue } from '../constants/tile-value';
import { Clients, Rooms } from '../services';
import { CustomSocket } from '../types/client.types';

export const registerGameHandler = (socket: CustomSocket, clientId: string) => {
  const client = Clients.get(clientId);

  // meskipun nggak mungkin sih client undefined
  if (!client) {
    socket.emit('error', {
      message: 'Something went wrong : client not found, hmph',
    });
    return;
  }

  socket.on('move', (tile: number) => {
    if (!client.roomId) {
      socket.emit('error', {
        message: 'Your clientId has no room, baka!',
      });
      return;
    }

    const room = Rooms.get(client.roomId);
    if (!room) {
      socket.emit('error', {
        message: 'Your roomId is not a valid room, baka!',
      });
      return;
    }

    if (room.data.currentTurn != clientId) {
      socket.emit('error', {
        message: 'Not your turn, baka!',
      });
      return;
    }

    room.data.board[tile] = clientId == room.host ? TileValue.X : TileValue.O; // pake enum
    room.data.currentTurn = room.players.find((value) => value != clientId);

    socket.emit('success', {
      newBoard: room.data.board,
    });

    // cek ada yang win nanti disini!
  });
};
