import Async from "../utils/Async.js";
import AppError from "../utils/Error/AppError.js";
import User from "../models/User.js";

export const getUserProfileInfo = Async(async function (req, res, next) {
  const { userId } = req.params;

  const user = await User.findById(userId).select("email name");

  if (!user) return next(new AppError(404, "user not found"));

  res.status(200).json(user);
});
