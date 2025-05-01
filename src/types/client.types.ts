import { Socket } from 'socket.io';

export interface CustomSocket extends Socket {
  handshake: Socket['handshake'] & {
    auth: {
      clientId?: string;
    };
  };
}
