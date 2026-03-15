const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const postsController = require('../controllers/posts.controller');

const router = express.Router();

router.get('/', postsController.getFeed);
router.post('/', authMiddleware, postsController.createPost);
router.post('/:postId/like', authMiddleware, postsController.likePost);
router.post('/:postId/comments', authMiddleware, postsController.addComment);

module.exports = router;
