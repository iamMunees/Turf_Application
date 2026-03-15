const mongoose = require('mongoose');

const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lineup';
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

module.exports = connectDatabase;
