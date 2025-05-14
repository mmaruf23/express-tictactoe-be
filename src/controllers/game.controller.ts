import { Socket } from 'socket.io';
import { TileValue } from '../constants/tile-value';
import { Clients, Rooms } from '../services';
import { getIO } from '../socket';

/**
 * Registers the game event handlers for a specific client socket.
 *
 * @param socket - The socket instance for the connected client.
 * @param clientId - The unique identifier of the client.
 *
 * @remarks
 * This function sets up the `move` event listener for the client socket.
 * It ensures that the client is part of a valid room and handles the game logic
 * for making a move, updating the game board, and switching turns.
 *
 * @event move
 * - Triggered when a client attempts to make a move.
 * - Validates the client's room and turn before updating the game board.
 * - Emits an `update-board` event to all clients in the room with the updated board state.
 *
 * @emits error
 * - Emitted when the client encounters an error, such as:
 *   - Client not found.
 *   - Client not being part of a room.
 *   - Invalid room ID.
 *   - Attempting to make a move when it's not their turn.
 *
 * @emits update-board
 * - Emitted to all clients in the room with the updated board state after a valid move.
 */
export const registerGameHandler = (socket: Socket, clientId: string) => {
  const client = Clients.get(clientId);
  const io = getIO();

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

    io.to(client.roomId).emit('update-board', {
      newBoard: room.data.board,
    });

    // cek ada yang win nanti disini!
  });
};
