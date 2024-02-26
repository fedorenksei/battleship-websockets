import { Id, Ship } from 'app/utils/commands-types';
import { UserNotInGameError } from '../utils/errors';
import { Connection } from 'app/websocketConnection';

// const games = new Map<Id, Game>();
let gamesCount = 0;

export class Game {
  id: Id;
  players: [
    { user: Connection; ships?: Ship[] },
    { user: Connection; ships?: Ship[] },
  ];

  constructor({
    gameId,
    users,
  }: {
    gameId: Id;
    users: [Connection, Connection];
  }) {
    this.id = gameId;
    this.players = [{ user: users[0] }, { user: users[1] }];
  }

  addShips({ user, ships }: { user: Connection; ships: Ship[] }) {
    if (user !== this.players[0].user && user !== this.players[1].user)
      throw new UserNotInGameError();

    const [currentPlayer, otherPlayer] =
      user === this.players[0].user
        ? this.players
        : [this.players[1], this.players[0]];

    currentPlayer.ships = ships;

    if (!otherPlayer.ships) return;
    currentPlayer.user.startGame(currentPlayer.ships);
    otherPlayer.user.startGame(otherPlayer.ships);
  }
}

export function createGame(users: [Connection, Connection]) {
  const gameId = gamesCount++;
  const game = new Game({ gameId, users });
  return game;
}
