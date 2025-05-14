import { TileValue } from '../constants/tile-value';

export interface Room {
  roomId: string;
  host: string;
  players: string[];
  data: {
    board: TileValue[];
    currentTurn?: string;
  };
}

export const Rooms = new Map<string, Room>();
