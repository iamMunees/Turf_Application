require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes');

const createNoopIo = () => ({
  emit() {},
});

const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:5173'];

const normalizeOrigin = (value) => {
  if (!value) {
    return null;
  }

  return value.replace(/\/$/, '');
};

const allowedOrigins = new Set(
  [process.env.CLIENT_URL, process.env.CLIENT_URL_PREVIEW, ...DEFAULT_ALLOWED_ORIGINS]
    .map(normalizeOrigin)
    .filter(Boolean),
);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);

  if (allowedOrigins.has(normalizedOrigin)) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(normalizedOrigin);
    return protocol === 'https:' && hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

const createApp = (io = createNoopIo()) => {
  const app = express();
  app.disable('etag');
  app.set('io', io);

  app.use(
    cors({
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
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
