import { Id, User } from 'app/utils/commands-types';
import { UnregisteredUserError, handleError } from './utils/errors';
import { RequestPayload, ResponsePayload } from 'app/utils/types';
import { WebSocket } from 'ws';
import { createGame } from './models/games';
import { createRoom, getRooms, joinRoom } from './models/rooms';
import { register } from './models/users';
import { getWinners } from './models/winners';

export class Connection {
  ws: WebSocket;
  roomId?: Id;
  gameId?: Id;
  user?: User;
  static users = new Set<Connection>();
  static userIdInstanceMap = new Map<Id, Connection>();

  constructor(ws: WebSocket) {
    this.ws = ws;
    ws.on('message', (payloadRaw) => {
      const { type, data: dataString } = JSON.parse(String(payloadRaw));
      const data = dataString ? JSON.parse(dataString) : '';
      try {
        this.handleMessage({ type, data });
      } catch (err) {
        handleError(err);
      }
    });
  }

  static updateRooms() {
    Connection.users.forEach((user) => user.updateRooms());
  }
  static updateWinners() {
    Connection.users.forEach((user) => user.updateWinners());
  }

  private handleMessage({ type, data }: RequestPayload) {
    if (type === 'reg') {
      const result = register(data);
      this.send({ type, data: result });
      if (result.error) return;
      this.user = { name: result.name, index: result.index };
      Connection.users.add(this);
      Connection.userIdInstanceMap.set(this.user.index, this);
      this.updateRooms();
      this.updateWinners();
    } else if (!this.user) throw new UnregisteredUserError();

    if (type === 'create_room') {
      createRoom(this.user);
      Connection.updateRooms();
    }
    if (type === 'add_user_to_room') {
      const { index: enemyId } = joinRoom({ data, user: this.user });
      const enemy = Connection.userIdInstanceMap.get(enemyId);
      if (!enemy || !enemy?.user?.index) throw new UnregisteredUserError();

      Connection.updateRooms();
      const { gameId } = createGame([this.user.index, enemyId]);
      this.gameId = gameId;
      enemy.gameId = gameId;
      this.createGame(gameId);
      enemy.createGame(gameId);
    }
  }

  private updateRooms() {
    this.send({ type: 'update_room', data: getRooms() });
  }
  private updateWinners() {
    this.send({ type: 'update_winners', data: getWinners() });
  }
  private createGame(gameId: Id) {
    if (!this.user) return;
    this.send({
      type: 'create_game',
      data: { idGame: gameId, idPlayer: this.user.index },
    });
  }

  private send({ type, data }: ResponsePayload) {
    console.log(`Send response: ${JSON.stringify({ type, data })}`);
    this.ws.send(
      JSON.stringify({
        type,
        data: JSON.stringify(data),
        id: 0,
      }),
    );
  }
}
