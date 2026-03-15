const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const serializeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  username: user.username || user.email.split('@')[0].toLowerCase(),
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  city: user.city || '',
  favoriteSports: user.favoriteSports || [],
  skillLevel: user.skillLevel || 'Intermediate',
  playingPosition: user.playingPosition || 'Utility',
  bio: user.bio || '',
  avatarUrl: user.avatarUrl || '',
});

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET || 'lineup-secret',
    { expiresIn: '7d' },
  );

exports.register = async (req, res) => {
  try {
    const { fullName, username, email, password, role, favoriteSports = [], city } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      username: username?.toLowerCase().trim() || email.split('@')[0].toLowerCase(),
      email,
      passwordHash,
      role,
      favoriteSports,
      city,
    });

    return res.status(201).json({
      success: true,
      token: signToken(user),
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    return res.json({
      success: true,
      token: signToken(user),
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
