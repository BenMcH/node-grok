const net = require('net');

const HOST = '0.0.0.0';

/*
    Steps in the listener

    1. Generate Connection id
    2. On Data, emit new custom event with event data
    3. Listen on same event for easy communication. Client just parrots back on the same channel
    4. Close on websocket close event
*/

const generateTransactionId = length => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const listener = websocket => sock => {
  // We have a connection - a socket object is assigned to the connection automatically
  console.log(`CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`);

  const transId = generateTransactionId(32);
  const eventString = `event`;

  websocket.on(`${eventString}-${transId}`, data => sock.write(data));

  sock.on('data', data => {
    // console.log(`DATA ${sock.remoteAddress}: ${data}`);
    // Write the data back to the socket, the client will receive it as data from the server
    websocket.emit(eventString, { data, transId });
  });
  // Add a 'close' event handler to this instance of socket
  sock.on('close', data => {
    websocket.emit(`close`, { transId });
    console.log(`CLOSED: ${sock.remoteAddress} ${sock.remotePort}`);
  });
};

exports.createServer = (port, websocket) => {
  const server = net.createServer(listener(websocket)).listen(port, HOST);
  websocket.on('disconnect', () => server.close());
  console.log(`created server for webhook on port ${port}`);
};
