import Async from "../utils/Async.js";
import User from "../models/User.js";

export const getUser = Async(async function (req, res, next) {
  res.status(200).json("db response");
});
