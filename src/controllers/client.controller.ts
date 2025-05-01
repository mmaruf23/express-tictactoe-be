import { Socket } from 'socket.io';
import { Clients, Rooms } from '../services';
import { randomUUID } from 'crypto';

export const registerClientHandler = (socket: Socket) => {
  socket.on('auth', (clientId?: string) => {
    // cek parameter clientId jika tidak ada generate dengan randomUUID();
    if (!clientId) {
      const newKey = randomUUID();
      Clients.set(newKey, {
        socket: [socket],
      });
      return;
    }

    // cek client apakah ada di memory jika tidak ada buatkan saja.
    let client = Clients.get(clientId);
    if (!client) {
      Clients.set(clientId, {
        socket: [socket],
      });
      return;
    }

    // jika ada tambahkan socket
    client.socket.push(socket);
  });

  socket.on('disconnect', () => {
    // lanjut disini oke
  });
};
