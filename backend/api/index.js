const createApp = require('../app');
const connectDatabase = require('../src/config/database');
const app = createApp();

module.exports = async (req, res) => {
  await connectDatabase();
  return app(req, res);
};
