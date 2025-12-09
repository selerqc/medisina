import rateLimit from "express-rate-limit";
import { StatusCodes } from "http-status-codes";


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: StatusCodes.TOO_MANY_REQUESTS,
    error: "Too many authentication requests, please try again in 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    status: StatusCodes.TOO_MANY_REQUESTS,
    error: "Too many requests, please try again in 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});

export function initRateLimit(app) {
  app.use("/auth", authLimiter);
  app.use("/api", apiLimiter);
}


