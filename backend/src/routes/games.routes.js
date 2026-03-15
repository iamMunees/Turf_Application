const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const gamesController = require('../controllers/games.controller');

const router = express.Router();

router.get('/bootstrap', gamesController.bootstrap);
router.get('/', gamesController.getGames);
router.get('/clubs', gamesController.getClubs);
router.get('/:id', gamesController.getGameById);
router.get('/:id/players', gamesController.getGamePlayers);
router.post('/create', authMiddleware, gamesController.createGame);
router.post('/join', authMiddleware, gamesController.joinGame);
router.post('/comment', authMiddleware, gamesController.addComment);

module.exports = router;
