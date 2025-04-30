import { NextFunction, Request, Response } from 'express';
import { Room, Rooms } from '../services';
import { HttpStatus } from '../constants';

/**
 * Middleware untuk cek apakah room ada atau tidak
 *
 * @param req - Request from Express with properti roomId: string, and roomData: Room from service for set to controller, so inggis anjai
 * @param res - Response from Exrpress
 * @param next - Aja sendiri
 * @returns - Aja sendiri
 */
export const validRoom = (
  req: Request<{}, {}, { roomId: string; roomData?: Room }>,
  res: Response,
  next: NextFunction
) => {
  const { roomId } = req.body;
  const roomData = Rooms.get(roomId);

  if (!roomData) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Room unavailable',
    });
    return;
  }

  req.body.roomData = roomData;

  next();
};
