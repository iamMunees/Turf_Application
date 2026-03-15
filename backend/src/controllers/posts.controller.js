const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'fullName role avatarUrl');

    return res.json({ success: true, posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      author: req.user.id,
    });

    if (req.io) {
      req.io.emit('post:created', post);
    }

    return res.status(201).json({ success: true, post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $addToSet: {
          likes: req.user.id,
        },
      },
      { new: true },
    );

    return res.json({ success: true, post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user.id,
      text: req.body.text,
    });

    if (req.io) {
      req.io.emit('comment:created', comment);
    }

    return res.status(201).json({ success: true, comment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
