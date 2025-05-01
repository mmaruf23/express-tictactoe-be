import { Socket } from 'socket.io';

export interface Client {
  roomId?: string;
  socket: Socket[];
}

export const Clients = new Map<string, Client>();
