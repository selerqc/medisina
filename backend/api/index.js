import app from '../src/app.js';
import config from '../src/config/config.js';
import logger from '../src/logger/logger.js';
import mongoose from 'mongoose';
import cache from '../src/utils/cache.js';

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    logger.info('Using existing MongoDB connection');
    return true;
  }

  if (connectionPromise) {
    logger.info('Waiting for existing connection attempt');
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const mongoUri = config.mongoDb.MONGO_URI;

      if (!mongoUri) {
        throw new Error('MONGO_URI is not defined in environment variables');
      }

      if (mongoUri?.includes('mongodb+srv')) {
        logger.info('Using MongoDB Atlas');
      }

      await mongoose.connect(config.mongoDb.MONGO_URI, {
        ...config.mongoDb.options
      });

      isConnected = true;
      logger.info('Connected to MongoDB successfully');

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
        isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        isConnected = false;
        connectionPromise = null;
      });

      return true;
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      isConnected = false;
      connectionPromise = null;
      throw error;
    }
  })();

  return connectionPromise;
};

cache.connect().catch(err => {
  logger.error('Failed to initialize cache:', err);
});

const handler = async (req, res) => {
  try {
    await connectDB();

    return app(req, res);
  } catch (error) {
    logger.error('Failed to establish database connection:', error);
    res.status(503).json({
      error: 'Service temporarily unavailable. Please try again.',
      message: 'Database connection failed'
    });
  }
};

export default handler;
