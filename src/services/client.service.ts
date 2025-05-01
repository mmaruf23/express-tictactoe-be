import { Socket } from 'socket.io';

export interface Client {
  roomId?: string;
  socket: Set<Socket>;
}

export const Clients = new Map<string, Client>();
