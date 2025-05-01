import { Clients } from '../services';
import { randomUUID } from 'crypto';
import { CustomSocket } from '../types/client.types';

/**
 * Untuk handling socket client. ah pusing saya
 * @param socket - CustomSocket extends Socket: socket.io
 */
export const registerClientHandler = (socket: CustomSocket) => {
  let clientId = socket.handshake.auth.clientId;
  if (clientId) {
    if (!Clients.has(clientId)) {
      Clients.set(clientId, {
        socket: new Set(),
      });
    }
  } else {
    clientId = randomUUID();
    Clients.set(clientId, {
      socket: new Set(),
    });
  }

  Clients.get(clientId)?.socket.add(socket);

  socket.on('disconnect', () => {
    const client = Clients.get(clientId);
    if (client) {
      client.socket.delete(socket);
      if (client.socket.size === 0) {
        Clients.delete(clientId);
      }
    }
  });

  return clientId;
};
