const net = require('net');
const argv = require('minimist')(process.argv.slice(2));
const socketio = require('socket.io-client');

console.log(argv);

const transactions = {};

const port = argv.port || argv.p;
const { server } = argv;

if (port && server) {
  const socket = socketio(`ws://${server}`);

  socket.on('connect', () => {
    console.log(`Connected. Forwarding traffic to: localhost:${port}`);
  });

  socket.on('notice', data => {
    const newData = data.replace(/\$SERVER/g, server.replace(/:\d*/, ''));
    console.log(newData);
  });

  socket.on('event', ({ data, transId }) => {
    if (!transactions[transId]) {
      const client = new net.Socket();
      client.connect(port, '127.0.0.1', function() {
        console.log('Connected');
        client.write(data);
      });
      client.on('data', function(clientData) {
        socket.emit(`event-${transId}`, clientData);
      });

      client.on('error', console.error);

      client.on('close', function() {
        console.log('Connection closed');
        client.destroy();
      });
      transactions[transId] = { socket, client };
    } else {
      const { client } = transactions[transId];
      client.write(data);
    }
  });
}
