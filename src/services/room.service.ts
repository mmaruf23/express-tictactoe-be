export interface Room {
  host: string;
  players: string[];
  data: {
    board: string[]; // next ganti jadi enum, maghriban dulu
    currentTurn?: string;
  };
}

export const Rooms = new Map<string, Room>();
