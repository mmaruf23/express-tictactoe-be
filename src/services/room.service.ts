import { TileValue } from '../constants/tile-value';

export interface Room {
  host: string;
  players: string[];
  data: {
    board: TileValue[];
    currentTurn?: string;
  };
}

export const Rooms = new Map<string, Room>();
