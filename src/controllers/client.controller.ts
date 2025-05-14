import { Clients, Rooms } from '../services';
import { randomInt, randomUUID } from 'crypto';
import { Socket } from 'socket.io';

type UserData = {
  clientId: string | undefined;
  username: string | undefined;
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

  if (!username) {
    username = `Guest${randomInt(100, 999)}`;
  }

  client.socket.add(socket);
  client.username = username;

  const dataResponse: UserData = {
    username: username,
    clientId: clientId,
  };

  socket.emit('init-response', dataResponse);

  const rooms = Array.from(Rooms.values()).map(({ host, players, roomId }) => ({
    roomId,
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
    dataResponse.username = name;
    client.username = name;
    client.socket.forEach((each) => {
      each.emit('init-response', dataResponse);
      console.log('emit terkirim ke ', each.id);
    });

    console.log(Clients);
  });

  console.log(Clients);
  return clientId;
};
