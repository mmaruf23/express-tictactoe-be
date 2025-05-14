import { Clients, Rooms } from '../services';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';

type UserData = {
  clientId: string;
  username: string;
};

/**
 * Untuk handling socket client. ah pusing saya
 * @param socket - CustomSocket extends Socket: socket.io
 */
export const registerClientHandler = (
  socket: Socket,
  userData: UserData
): string => {
  let { clientId, username } = userData;

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

  const client = Clients.get(clientId);
  if (!client) {
    // Jika client tidak ditemukan, lempar error
    throw new Error(`Ada masalah anjai!, javascript ng'bug`);
  }

  client.socket.add(socket);
  client.username = username;

  socket.emit('init-response', {
    username: username,
    clientId: clientId,
  });

  const rooms = Array.from(Rooms.values()).map(({ host, players }) => ({
    host,
    players,
  }));

  socket.emit('update-room', rooms);

  socket.on('disconnect', () => {
    client.socket.delete(socket);
    if (client.socket.size === 0) {
      Clients.delete(clientId);
    }
    console.log(Clients);
  });

  socket.on('update-name', (name: string) => {
    client.username = name;
    client.socket.forEach((each) => {
      each.emit('update-name-response', name);
      console.log('emit terkirim ke ', each.id);
    });

    console.log('nama baru', name);
  });

  console.log(Clients);
  return clientId;
};
