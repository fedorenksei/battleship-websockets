type RequestCommands = {
  reg: {
    name: string;
    password: string;
  };
  create_room: '';
  add_user_to_room: {
    indexRoom: number | string;
  };
  add_ships: {
    gameId: number | string;
    ships: {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: 'small' | 'medium' | 'large' | 'huge';
    }[];
    indexPlayer: number | string;
  };
};

type ResponseCommands = {
  reg: {
    name: string;
    index: number | string;
    error: boolean;
    errorText: string;
  };
  update_winners: {
    name: string;
    wins: number;
  }[];
  create_game: {
    idGame: number | string;
    idPlayer: number | string;
  };
  update_room: [
    {
      roomId: number | string;
      roomUsers: [
        {
          name: string;
          index: number | string;
        },
      ];
    },
  ];
};

type ExtractedPayloadTypes<T extends Record<string, unknown>> = {
  [K in keyof T]: { type: K; data: T[K] };
};
type Payload<T extends Record<string, unknown>> =
  ExtractedPayloadTypes<T>[keyof T];

export type RequestPayload = Payload<RequestCommands>;
export type ResponsePayload = Payload<ResponseCommands>;
