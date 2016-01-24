const wsServer = require('ws').Server;
const wss = new wsServer({ port: 7263 });
const log = _ => (console.log(_), _)

wss.on('connection', ws => {
  ws.on('message', message => ws.send(log(message)));
});
