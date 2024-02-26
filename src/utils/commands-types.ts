export type Coordinates = {
  x: number;
  y: number;
};

export type Id = number;

type Ship = {
  position: Coordinates;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};

export type User = {
  name: string;
  index: Id;
};

export type Room = {
  roomId: Id;
  roomUsers: User[];
};

export type RequestCommands = {
  reg: {
    name: string;
    password: string;
  };
  create_room: '';
  add_user_to_room: {
    indexRoom: Id;
  };
  add_ships: {
    gameId: Id;
    ships: Ship[];
    indexPlayer: Id;
  };
  attack: Coordinates & {
    gameId: Id;
    indexPlayer: Id;
  };
  randomAttack: {
    gameId: Id;
    indexPlayer: Id;
  };
};

export type ResponseCommands = {
  reg: User & {
    error: boolean;
    errorText: string;
  };
  update_winners: {
    name: string;
    wins: number;
  }[];
  create_game: {
    idGame: Id;
    idPlayer: Id;
  };
  update_room: Room[];
  start_game: {
    ships: Ship[];
    currentPlayerIndex: Id;
  };
  attack: {
    position: Coordinates;
    currentPlayer: Id;
    status: 'miss' | 'killed' | 'shot';
  };
  turn: {
    currentPlayer: Id;
  };
  finish: {
    winPlayer: Id;
  };
};
