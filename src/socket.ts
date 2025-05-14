import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ClientController, GameController } from './controllers';

let io: Server | undefined;

/**
 * Sets up the Socket.IO server and configures it to handle client connections.
 *
 * @param server - The HTTP server instance to attach the Socket.IO server to.
 *
 * This function initializes the Socket.IO server with CORS settings to allow
 * connections from `http://localhost:3000`. It listens for client connections
 * and registers handlers for client and game-related events using the
 * `ClientController` and `GameController`.
 */

export function setUpSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    const defaultUserData: { clientId: undefined; username: undefined } = {
      username: undefined,
      clientId: undefined,
    };

    socket.once('init', (rawData: string | null) => {
      const userData: { clientId: string; username: string } = rawData
        ? JSON.parse(rawData)
        : defaultUserData;

      const clientId = ClientController.registerClientHandler(socket, userData);
      GameController.registerGameHandler(socket, clientId);
    });
  });
}
/**
 * Retrieves the initialized Socket.IO server instance.
 *
 * @returns The Socket.IO server instance.
 *
 * @throws Error if the Socket.IO server has not been initialized.
 *
 * This function ensures that the Socket.IO server is properly initialized
 * before returning it. If the server is not initialized, it throws an error.
 */
export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO not initialize');
  }
  return io;
}
