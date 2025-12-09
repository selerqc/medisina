
import { StatusCodes } from "http-status-codes";

export const routeNotFound = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).send(`Not found - ${req.originalUrl}`)
  next();
};

export default routeNotFound;
