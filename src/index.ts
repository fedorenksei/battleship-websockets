import { WebSocketServer } from 'ws';
import { Connection } from './app/websocketConnection';
import { httpServer } from './http_server/index';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

console.log(`Start websocket server on the ${HTTP_PORT} port!`);
const wss = new WebSocketServer({ port: WS_PORT });
wss.on('connection', function (ws) {
  new Connection(ws);
});
