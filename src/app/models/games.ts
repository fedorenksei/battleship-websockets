import { Id, RequestCommands, Ship } from 'app/utils/commands-types';
import { Connection } from 'app/websocketConnection';
import { UserNotInGameError } from '../utils/errors';
import { Field } from './field';

let gamesCount = 0;

type Player = {
  user: Connection;
  ships?: Ship[];
  field?: Field;
};

export class Game {
  id: Id;
  players: [Player, Player];
  isTurnForSecond = false;

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
    const { currentPlayer, otherPlayer } = this.getPlayers(user);

    currentPlayer.ships = ships;
    currentPlayer.field = new Field(ships);

    if (!otherPlayer.ships) return;
    currentPlayer.user.startGame(currentPlayer.ships);
    otherPlayer.user.startGame(otherPlayer.ships);
    this.sendTurns();
  }

  attack({
    user,
    position,
  }: {
    user: Connection;
    position: RequestCommands['attack'];
  }) {
    const { currentPlayer, otherPlayer } = this.getPlayers(user);
    const isShot = otherPlayer.field?.attack(position);
    const status = isShot ? 'shot' : 'miss';
    if (!currentPlayer.user.user) return;
    const userId = currentPlayer.user.user.index;
    this.players.forEach((player) =>
      player.user.sendAttackFeedback({
        currentPlayer: userId,
        position,
        status,
      }),
    );
    this.isTurnForSecond = !this.isTurnForSecond;
    this.sendTurns();
  }

  sendTurns() {
    const currentPlayer = this.players[this.isTurnForSecond ? 1 : 0];
    if (!currentPlayer.user.user) return;
    const userId = currentPlayer.user.user.index;
    this.players.forEach((player) => player.user.sendTurn(userId));
  }

  private getPlayers(user: Connection) {
    if (user !== this.players[0].user && user !== this.players[1].user)
      throw new UserNotInGameError();

    const [currentPlayer, otherPlayer] =
      user === this.players[0].user
        ? this.players
        : [this.players[1], this.players[0]];

    return { currentPlayer, otherPlayer };
  }
}

export function createGame(users: [Connection, Connection]) {
  const gameId = gamesCount++;
  const game = new Game({ gameId, users });
  return game;
}
