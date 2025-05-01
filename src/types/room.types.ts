import { Socket } from 'socket.io';
import { Client, Room } from '../services';

export interface createRoomBody {
  client: string;
  clientData: Client;
}

export interface joinRoomBody {
  client: string;
  roomId: string;
  clientData: Client;
  roomData: Room;
}

export interface CustomSocket extends Socket {
  handshake: Socket['handshake'] & {
    auth: {
      clientId?: string;
    };
  };
}
