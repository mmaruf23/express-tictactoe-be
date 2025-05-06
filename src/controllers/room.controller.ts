import { Request, Response } from 'express';
import { Clients, Room, Rooms } from '../services';
import { randomUUID } from 'crypto';
import { HttpStatus } from '../constants';
import { createRoomBody, joinRoomBody } from '../types/room.types';
import { getIO } from '../socket';

export const create = (req: Request<{}, {}, createRoomBody>, res: Response) => {
  const newKey = randomUUID();
  const { client, clientData } = req.body;
  const io = getIO();

  const createdRoom: Room = {
    host: client,
    players: [client],
    data: {
      board: new Array(6).fill(null),
    },
  };
  Rooms.set(newKey, createdRoom);
  clientData.socket.forEach((socket) => {
    socket.join(newKey);
  });
  clientData.roomId = newKey;

  res.status(HttpStatus.CREATED).json({
    message: 'Room created successfully',
  });

  const rooms = Array.from(Rooms.values()).map(({ host, players }) => ({
    host,
    players,
  }));
  io.emit('update-room', rooms);
};

export const join = (req: Request<{}, {}, joinRoomBody>, res: Response) => {
  const { client, roomId, clientData, roomData } = req.body;

  if (roomData.players.length >= 2) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Room is full',
    });
    return;
  }

  // join room
  clientData.socket.forEach((socket) => {
    socket.join(roomId);
  });
  clientData.roomId = roomId;
  roomData.players.push(client);
  roomData.data.currentTurn = client;

  res.status(HttpStatus.OK).json({
    message: 'Success join room',
  });
};

/**
 * Method untuk leave room yang ada di memory dan juga socket. (semua socket akan leave)
 * @param req - Express Request with body: joinRoomBody
 * @param res - Express Response
 */
export const leave = (req: Request<{}, {}, joinRoomBody>, res: Response) => {
  const { client, roomId, clientData, roomData } = req.body;

  if (clientData.roomId !== roomId) {
    res.status(HttpStatus.FORBIDDEN).json({
      message: 'client memang tidak ada di room ini!, ada ada aja. hmph.',
    });
  }
  clientData.socket.forEach((socket) => {
    socket.leave(roomId);
  });
  clientData.roomId = undefined;
  const index = roomData.players.indexOf(client);
  roomData.players.splice(index, 1);

  res.status(HttpStatus.OK).json({
    message: 'Success leave room',
  });
};

/**
 * Method untuk hapus room dan akan leave room yang ada di memory dan juga socket. (semua socket akan leave)
 * @param req - Express Request with body: joinRoomBody
 * @param res - Express Response
 */
export const erase = (req: Request<{}, {}, joinRoomBody>, res: Response) => {
  const { client, roomId, roomData } = req.body;

  if (roomData.host !== client) {
    res.status(HttpStatus.FORBIDDEN).json({
      message: 'Cannot delete this room',
    });
  }

  Rooms.get(roomId)?.players.forEach((player) => {
    const playerData = Clients.get(player);
    if (playerData) {
      playerData.socket.forEach((socket) => {
        socket.leave(roomId);
      });
      playerData.roomId = undefined;
    }
  });

  Rooms.delete(roomId);

  res.status(HttpStatus.OK).json({
    message: 'Succesfully deleted',
  });
};
