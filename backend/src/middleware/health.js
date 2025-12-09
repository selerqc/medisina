import mongoose from 'mongoose';
// import cache from '#utils/cache.js';

export const healthCheck = async (req, res) => {
  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'unknown',
      // cache: 'unknown'
    }
  };

  try {
    if (mongoose.connection.readyState === 1) {
      healthStatus.services.database = 'connected';
    } else {
      healthStatus.services.database = 'disconnected';
      healthStatus.status = 'degraded';
    }
  } catch (error) {
    healthStatus.services.database = 'error';
    healthStatus.status = 'degraded';
  }

  // try {
  //   const cacheStatus = cache.getConnectionStatus();
  //   healthStatus.services.cache = cacheStatus ? 'connected' : 'disconnected';
  //   if (!cacheStatus) {
  //     healthStatus.status = 'degraded';
  //   }
  // } catch (error) {
  //   healthStatus.services.cache = 'error';
  //   healthStatus.status = 'degraded';
  // }

  const statusCode = healthStatus.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
};
