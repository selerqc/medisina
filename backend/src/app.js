import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import routeNotFound from '#middleware/routeNotFound.js'
import Route from '#modules/index.js'
import logger from '#logger/logger.js';
import MongoStore from 'connect-mongo';
import config from '#config/config.js';
import passport from 'passport';

import { initCORS } from '#config/startup/cors.js'
import { initializePassport } from '#config/passport.js';
import { logAuditTrails } from '#middleware/auditTrail.js';
import { initRateLimit } from '#config/startup/apilimiter.js';
import { initProd } from '#config/startup/prod.js';
import { healthCheck } from '#middleware/health.js';



const app = express();

initializePassport()
initCORS(app)
initProd(app)
initRateLimit(app)


const sessionMiddleware = session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.mongoDb.MONGO_URI,
    ttl: 30 * 60,
    touchAfter: 24 * 3600
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 30,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? undefined : undefined,
  },
  name: 'medisync.sid',
  rolling: true,
  proxy: true, // Trust the reverse proxy
});

app.use(sessionMiddleware);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(passport.initialize());
app.use(passport.session());
app.use(logAuditTrails)

app.get('/health', healthCheck);


app.use('/api/v1', Route);

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});


app.use(routeNotFound)

app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    meta: `path:${req.url} | method:${req.method} | error:${err.message}`
  });
  const status = err.statusCode || 500;

  if (res.headersSent) {
    return next(err);
  }

  if (err.isJoi) {
    return res.status(status).json({
      field: err.details[0].context.key,
      error: err.details[0].message.replace(/[""]/g, '')
    });
  }

  const errorResponse = {
    error: err.message,
    timestamp: new Date().toUTCString(),
    path: req.path
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  return res.status(status).json(errorResponse);
});

export { sessionMiddleware };
export default app