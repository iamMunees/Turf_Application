require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDatabase = require('./src/config/database');
const registerSocketHandlers = require('./src/socket');
const apiRoutes = require('./src/routes');

const app = express();
const server = http.createServer(app);
app.disable('etag');
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    });
  }
  next();
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Lineup API is running',
    date: new Date().toISOString(),
  });
});

app.use('/api', apiRoutes(io));

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
