export interface Room {
  host: string;
  players: string[];
  data: {
    board: (number | null)[];
    currentTurn?: string;
  };
}

export const Rooms = new Map<string, Room>();
