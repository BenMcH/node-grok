const io = require('socket.io')();
const { createServer } = require('./socket');

let connections = [];

io.on('connection', function(socket) {
  console.log('a user connected');
  const port = Math.floor(Math.random() * 100 + 20300);
  createServer(port, socket);
  socket.emit('notice', `Server listening on: $SERVER:${port}`);
  const connection = {
    id: '',
    sendEvent: (eventType, args) => socket.emit(eventType, ...args),
    socket,
  };
  connections.push(connection);
  socket.on('disconnect', () => {
    connections = connections.filter(conn => conn !== connection);
    console.log('user disconnecting');
  });
});

io.listen(8888, function() {
  console.log('listening on *:8888');
});
