import { Id, User } from 'utils/commands-types';
import { RequestPayload, ResponsePayload } from 'utils/types';
import { WebSocket } from 'ws';
import { createRoom, getRooms, joinRoom } from './models/rooms';
import { register } from './models/users';
import { getWinners } from './models/winners';
import { UnregisteredUserError, handleError } from 'utils/errors';

export class Connection {
  ws: WebSocket;
  roomId?: Id;
  gameId?: Id;
  user?: User;
  static instancies = new Set<Connection>();

  constructor(ws: WebSocket) {
    this.ws = ws;
    Connection.instancies.add(this);
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
    Connection.instancies.forEach((ws) => ws.updateRooms());
  }

  static updateWinners() {
    Connection.instancies.forEach((ws) => ws.updateWinners());
  }

  private handleMessage({ type, data }: RequestPayload) {
    if (type === 'reg') {
      const result = register(data);
      this.send({ type, data: result });
      if (result.error) return;
      this.user = result;
      this.updateRooms();
      this.updateWinners();
    } else if (!this.user) throw new UnregisteredUserError();

    if (type === 'create_room') {
      createRoom(this.user);
      Connection.updateRooms();
    }
    if (type === 'add_user_to_room') {
      joinRoom({ data, user: this.user });
      Connection.updateRooms();
    }
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

  private updateRooms() {
    this.send({ type: 'update_room', data: getRooms() });
  }
  private updateWinners() {
    this.send({ type: 'update_winners', data: getWinners() });
  }
}
