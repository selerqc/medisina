import NodeCache from '@cacheable/node-cache';
import logger from '#logger/logger.js';

class MemoryCache {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.defaultTTL = 3600;
  }

  async connect() {
    try {
      if (this.client && this.isConnected) {
        logger.info('Cache client already connected');
        return true;
      }

      this.client = new NodeCache({
        stdTTL: this.defaultTTL,
        checkperiod: 600,
        useClones: false,
        deleteOnExpire: true,
        enableLegacyCallbacks: false,
        maxKeys: -1
      });

      this.client.on('set', (key, value) => {
        logger.info(`Key ${key} has been set with value ${value}`);
      });

      this.client.on('del', (key, value) => {
        logger.info(`Key ${key} has been deleted`);
      });

      this.client.on('expired', (key, value) => {
        logger.info(`Key ${key} has expired`);
      });

      this.client.on('flush', () => {
        logger.info('Cache has been flushed');
      });

      this.isConnected = true;

      logger.info('cache client initialized successfully');
      return true;
    } catch (error) {
      logger.error('Failed to initialize cache:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async set(key, value, ttl = this.defaultTTL) {
    if (!this.isConnected) return false;
    try {
      await this.client.set(key, value, ttl);
      return true;
    } catch (error) {
      logger.error(`Cache SET error for key ${key}:`, error);
      return false;
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    try {
      const data = await this.client.get(key);
      return data !== undefined ? data : null;
    } catch (error) {
      logger.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    try {
      await this.client.delete(key);
      return true;
    } catch (error) {
      logger.error(`Cache DEL error for key ${key}:`, error);
      return false;
    }
  }

  async delPattern(pattern) {
    if (!this.isConnected) return false;
    try {

      const regexPattern = pattern.replace(/\*/g, '.*').replace(/\?/g, '.');
      const regex = new RegExp(`^${regexPattern}$`);

      const keys = await this.client.keys();
      const matchingKeys = keys.filter(key => regex.test(key));

      if (matchingKeys.length > 0) {
        await this.client.del(matchingKeys);
      }
      return true;
    } catch (error) {
      logger.error(`Cache DEL pattern error for pattern ${pattern}:`, error);
      return false;
    }
  }

  async exists(key) {
    if (!this.isConnected) return false;
    try {
      const result = await this.client.has(key);
      return result;
    } catch (error) {
      logger.error(`Cache EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  async flushAll() {
    if (!this.isConnected) return false;
    try {
      await this.client.clear();
      return true;
    } catch (error) {
      logger.error('Cache FLUSHALL error:', error);
      return false;
    }
  }

  async ttl(key) {
    if (!this.isConnected) return -1;
    try {
      const ttl = await this.client.ttl(key);
      return ttl === 0 ? -1 : Math.floor(ttl / 1000);
    } catch (error) {
      logger.error(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      try {
        await this.client.flushAll();
        this.client = null;
        this.isConnected = false;
        logger.info('Cache client disconnected gracefully');
      } catch (error) {
        logger.error('Error disconnecting cache client:', error);
      }
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export default new MemoryCache();