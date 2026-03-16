const mongoose = require('mongoose');

const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/lineup';
const UNSUPPORTED_QUERY_PARAMS = ['turf_Application'];
let connectionPromise;

const sanitizeMongoUri = (mongoUri) => {
  if (!mongoUri) {
    return {
      uri: DEFAULT_MONGO_URI,
      changed: false,
    };
  }

  try {
    const parsed = new URL(mongoUri);
    let changed = false;

    for (const key of UNSUPPORTED_QUERY_PARAMS) {
      if (parsed.searchParams.has(key)) {
        parsed.searchParams.delete(key);
        changed = true;
      }
    }

    return {
      uri: parsed.toString(),
      changed,
    };
  } catch {
    return {
      uri: mongoUri,
      changed: false,
    };
  }
};

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const { uri, changed } = sanitizeMongoUri(process.env.MONGO_URI || DEFAULT_MONGO_URI);

  if (changed) {
    console.warn('Removed unsupported MongoDB URI query parameters before connecting.');
  }

  connectionPromise = mongoose
    .connect(uri)
    .then((connection) => {
      console.log('MongoDB connected');
      return connection;
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};

module.exports = connectDatabase;
