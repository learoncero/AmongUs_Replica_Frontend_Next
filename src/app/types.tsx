export type Game = {
  gameCode: string;
  numberOfPlayers: number;
  numberOfImpostors: number;
  map: string;
  players: Player[];
  gameID: number;
  tasks: Task[];
  sabotages: Sabotage[];
  gameStatus: GameStatus;
  reportedBodies: number[];
};

export type Player = {
  id: number;
  username: string;
  position: { x: number; y: number };
  role: Role;
  mirrored: boolean;
  moving: boolean;
};

export type Task = {
  id: number;
  miniGameId: number;
  title: string;
  description: string;
  Position: { x: number; y: number };
  completed: boolean;
};

export type Sabotage = {
  id: number;
  title: string;
  description: string;
};

export type ApiResponse<Data = unknown> = {
  statusText: string;
  status?: number;
  data?: Data;
};

export enum Role {
  CREWMATE = "CREWMATE",
  IMPOSTOR = "IMPOSTOR",
  CREWMATE_GHOST = "CREWMATE_GHOST",
  IMPOSTOR_GHOST = "IMPOSTOR_GHOST",
}

export enum GameStatus {
  CREWMATES_WIN = "CREWMATES_WIN",
  IMPOSTORS_WIN = "IMPOSTORS_WIN",
  LOBBY = "LOBBY",
  IN_GAME = "IN_GAME",
}

export type Map = {
  id: number;
  name: string;
  map: string[][];
};

export type Chat = {
  id: string;
};
