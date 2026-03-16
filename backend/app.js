require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes');

const createNoopIo = () => ({
  emit() {},
});

const createApp = (io = createNoopIo()) => {
  const app = express();
  app.disable('etag');
  app.set('io', io);

  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
    }),
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', (req, res, next) => {
    req.io = req.app.get('io');

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

  app.use('/api', apiRoutes());

  return app;
};

module.exports = createApp;
