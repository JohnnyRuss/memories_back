import Async from "../utils/Async.js";
import AppError from "../utils/Error/AppError.js";
import JWT from "../utils/JWT.js";
import User from "../models/User.js";

export const checkAuth = Async(async function (req, res, next) {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split(" ")[1];

  if (
    !authorizationHeader ||
    !authorizationHeader.startsWith("Bearer") ||
    !token
  )
    return next(new AppError(403, "You are not authorized"));

  const decodedToken = await JWT.verifyToken({ token });

  if (!decodedToken)
    return next(new AppError(403, "Token is invalid or is expired"));

  const isUserExists = await User.findById(decodedToken._id);

  if (!isUserExists) return next(new AppError(403, "User does not exists"));

  const user = {
    _id: isUserExists._id,
    email: isUserExists.email,
  };

  req.user = user;

  next();
});
