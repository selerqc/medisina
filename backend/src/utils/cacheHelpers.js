import cache from '#utils/cache.js';
import { CACHE_KEYS, CACHE_TTL } from '#utils/cacheKeys.js';
import logger from '#logger/logger.js';

export const withCache = (cacheKey, ttl = CACHE_TTL.MEDIUM) => {
  return (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const key = typeof cacheKey === 'function' ? cacheKey(...args) : cacheKey;

      try {
        const cachedData = await cache.get(key);
        if (cachedData) {
          logger.info(`Cache hit: ${key}`);
          return cachedData;
        }
      } catch (error) {
        logger.warn('Cache read error:', error);
      }

      const result = await originalMethod.apply(this, args);

      try {
        await cache.set(key, result, ttl);
      } catch (error) {
        logger.warn('Cache write error:', error);
      }

      return result;
    };

    return descriptor;
  };
};

export const invalidateCache = async (pattern) => {
  try {
    await cache.delPattern(pattern);
    logger.info(`Cache invalidated: ${pattern}`);
  } catch (error) {
    logger.error('Cache invalidation error:', error);
  }
};

export const cacheWrapper = async (key, fetchFunction, ttl = CACHE_TTL.MEDIUM) => {
  try {
    const cachedData = await cache.get(key);
    if (cachedData) {
      logger.info(`Cache hit: ${key}`);
      return cachedData;
    }
  } catch (error) {
    logger.warn('Cache read error:', error);
  }

  const data = await fetchFunction();

  try {
    await cache.set(key, data, ttl);
  } catch (error) {
    logger.warn('Cache write error:', error);
  }

  return data;
};
