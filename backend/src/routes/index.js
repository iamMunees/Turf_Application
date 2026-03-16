const express = require('express');
const authRoutes = require('./auth.routes');
const bookingsRoutes = require('./bookings.routes');
const cartRoutes = require('./cart.routes');
const eventsRoutes = require('./events.routes');
const gamesRoutes = require('./games.routes');
const messagesRoutes = require('./messages.routes');
const postsRoutes = require('./posts.routes');
const playersRoutes = require('./players.routes');
const productsRoutes = require('./products.routes');
const usersRoutes = require('./users.routes');
const venuesRoutes = require('./venues.routes');

const apiRoutes = () => {
  const router = express.Router();

  router.use('/auth', authRoutes);
  router.use('/bookings', bookingsRoutes);
  router.use('/cart', cartRoutes);
  router.use('/events', eventsRoutes);
  router.use('/games', gamesRoutes);
  router.use('/messages', messagesRoutes);
  router.use('/posts', postsRoutes);
  router.use('/players', playersRoutes);
  router.use('/products', productsRoutes);
  router.use('/users', usersRoutes);
  router.use('/venues', venuesRoutes);

  return router;
};

module.exports = apiRoutes;
