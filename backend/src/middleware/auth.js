import { StatusCodes } from 'http-status-codes';

export const auth = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Authentication required. Please Login',
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Forbidden: Access denied. Authorized Personnel Only',
        status: StatusCodes.IM_A_TEAPOT
      });
    }

    next();
  };
};
