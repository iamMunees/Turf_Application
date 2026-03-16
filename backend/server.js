const http = require('http');
const { Server } = require('socket.io');
const createApp = require('./app');
const connectDatabase = require('./src/config/database');
const registerSocketHandlers = require('./src/socket');
const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});
app.set('io', io);

registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Lineup API listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
