const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('feed:join', () => {
      socket.join('feed');
    });

    socket.on('games:join', () => {
      socket.join('games');
    });

    socket.on('messages:join', () => {
      socket.join('messages');
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = registerSocketHandlers;
