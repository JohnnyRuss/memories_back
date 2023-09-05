import ErrorUtils from "../utils/Error/Error.js";
import { NODE_ENV } from "../config/env.js";

const errorController = (err, req, res, next) => {
  let error = ErrorUtils.destructureError(err);

  if (error.name === "CastError") error = ErrorUtils.handleDBCastError(error);
  if (error.name === "ValidationError")
    error = ErrorUtils.handleDBValidationError(error);
  if (error.code === 11000)
    error = ErrorUtils.handleDBDuplicateFieldError(error);

  if (NODE_ENV === "DEV") {
    ErrorUtils.sendDevelopmentError(res, error);
  } else {
    ErrorUtils.sendProductionError(res, error);
  }
};

export default errorController;
