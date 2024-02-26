import { RequestPayload, ResponsePayload } from 'utils/types';
import { WebSocket } from 'ws';

const userNamesSet = new Set();

export class Connection {
  ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
    ws.on('message', (payloadRaw) => {
      const payload: RequestPayload = JSON.parse(String(payloadRaw));
      this.handleMessage(payload);
    });
  }

  handleMessage(payload: RequestPayload) {
    if (payload.type === 'reg') {
      const { name: requestName } = payload.data;
      let name = '',
        index = 0,
        error = false,
        errorText = '';
      if (userNamesSet.has(requestName)) {
        error = true;
        errorText = 'User with this username already logged in';
      } else {
        userNamesSet.add(requestName);
        name = requestName;
        index = userNamesSet.size;
      }
      this.send({ type: 'reg', data: { name, index, error, errorText } });
    }
  }

  send({ type, data }: ResponsePayload) {
    this.ws.send(
      JSON.stringify({
        type,
        data: JSON.stringify(data),
        id: 0,
      }),
    );
  }
}
