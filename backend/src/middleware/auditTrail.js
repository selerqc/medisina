import AuditTrailModel from "#modules/audit-trail/audit-trail.model.js";
import logger from "#logger/logger.js";
import requestIp from 'request-ip'
const methodMappers = {
  GET: "Fetching",
  POST: "Adding",
  PUT: "Updating",
  PATCH: "Partially Updating",
  DELETE: "Deleting"
};

export const logAuditTrails = (req, res, next) => {
  const originalJson = res.json;

  if (req.method === 'GET') return next()
  res.json = function (body) {
    const result = originalJson.call(this, body);

    process.nextTick(async () => {
      try {
        const ipAddress = requestIp.getClientIp(req)
        const activity = `${methodMappers[req.method] || req.method} ${req.originalUrl}`;
        const sanitizedPayload = { ...req.body };
        if (sanitizedPayload.password) sanitizedPayload.password = '***';

        await AuditTrailModel.create({
          url: req.originalUrl,
          user: req.user && req.user.firstName ? req.user.firstName : "",
          role: req.user && req.user.role ? req.user.role : "",
          activity,
          method: req.method,
          params: JSON.stringify(req.params || {}),
          query: JSON.stringify(req.query || {}),
          payload: JSON.stringify(sanitizedPayload || {}),
          response: JSON.stringify(body),
          ipAddress: JSON.stringify(ipAddress)
        });
      } catch (err) {
        logger.error("Audit log failed:", { meta: err.message });
      }
    });



    return result;
  };

  next();
};
