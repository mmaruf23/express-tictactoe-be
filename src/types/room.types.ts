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
