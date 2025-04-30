import { Socket } from 'socket.io';

export const registerClientHandler = (socket: Socket) => {
  socket.on('use-client', () => {
    // besok mulai disini
  });
};
