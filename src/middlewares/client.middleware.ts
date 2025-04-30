import { NextFunction, Request, Response } from 'express';
import { Client, Clients, Room, Rooms } from '../services';
import { HttpStatus } from '../constants';

/**
 * Middleware untuk memvalidasi apakah client yang diberikan di dalam body tersedia di Clients map.
 *
 * Anjai pakai JSDoc, bisa aja saya.
 * @param req - Objek Request Express dengan body yang berisi properti `client` bertipe string.
 * @param res - Objek Response Express untuk mengirimkan respons error jika client tidak ditemukan.
 * @param next - Fungsi untuk melanjutkan ke middleware berikutnya jika client valid.
 *
 * @returns Mengirim response 400 jika client tidak tersedia, atau memanggil `next()` jika valid.
 */

export const validClient = (
  req: Request<{}, {}, { client: string; clientData?: Client }>,
  res: Response,
  next: NextFunction
) => {
  const { client } = req.body;
  const clientData = Clients.get(client);

  if (!clientData) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Client unavailable',
    });
    return;
  }

  req.body.clientData = clientData;
  next();
};

/**
 * Middleware untuk validasi apakah client exist dan belum punya room
 * @param req - Objek Request Express dengan body client: string dan clientData untuk set data untuk digunakan di controller
 * @param res - Aja sendiri
 * @param next - Malass
 *
 * @returns Aja sendiri
 *  */
export const validClientWithoutRoom = (
  req: Request<{}, {}, { client: string; clientData?: Client }>,
  res: Response,
  next: NextFunction
) => {
  const { client } = req.body;
  const clientData = Clients.get(client);

  if (!clientData) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Client unavailable',
    });
    return;
  }

  if (clientData.roomId) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Client already in a room',
    });
    return;
  }

  req.body.clientData = clientData;

  next();
};

/**
 * Middleware untuk validasi apakah client exist dan sudah punya room
 * @param req - Objek Request Express dengan body client: string dan clientData untuk set data untuk digunakan di controller
 * @param res - Aja sendiri
 * @param next - Malass
 *
 * @returns Aja sendiri
 *  */
export const validClientWithRoom = (
  req: Request<
    {},
    {},
    { roomId: string; client: string; clientData?: Client; roomData: Room }
  >,
  res: Response,
  next: NextFunction
) => {
  const { client, roomId } = req.body;
  const clientData = Clients.get(client);

  if (!clientData) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Client unavailable',
    });
    return;
  }
  // cek apa bener udah join atau belum
  if (!clientData.roomId) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Client not in a room',
    });
    return;
  }

  // cek apakah room ada

  const roomData = Rooms.get(roomId);
  if (!roomData) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Room unavailable',
    });

    return;
  }

  req.body.clientData = clientData;
  req.body.roomData = roomData;

  next();
};
