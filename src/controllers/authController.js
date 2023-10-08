import Async from "../utils/Async.js";
import User from "../models/User.js";
import JWT from "../utils/JWT.js";
import AppError from "../utils/Error/AppError.js";

export const registerUser = Async(async function (req, res, next) {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return next(new AppError(400, "Confirm password must to match password"));

  const user = await User.create({
    email,
    password,
    name: `${firstName} ${lastName}`,
  });

  const { accessToken } = JWT.assignToken({
    res,
    payload: {
      _id: user._id,
      email: user.email,
    },
  });

  console.log(12);
  res.status(201).json({
    user: { _id: user._id, email: user.email, name: user.name },
    accessToken,
  });
});

export const loginUser = Async(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError(400, "Please enter valid credentials"));

  const user = await User.findOne({ email: email }).select(
    "+password email name"
  );

  if (!user) return next(new AppError(400, "Incorrect email or password"));

  const validPassword = await user.checkPassword(password, user.password);

  if (!validPassword)
    return next(new AppError(400, "Incorrect email or password"));

  user.password = undefined;

  const { accessToken } = JWT.assignToken(
    {
      _id: user._id,
      email: user.email,
    },
    res
  );

  res.status(200).json({ user, accessToken });
});

export const logoutUser = Async(async function (req, res, next) {
  res.clearCookie("authorization");
  res.status(204).json("user logged out");
});

export const refresh = Async(async (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) return next(new AppError(401, "you are not authorized"));

  const verifiedToken = await JWT.verifyToken({
    token: authorization,
    refreshToken: true,
  });

  if (!verifiedToken)
    return next(new AppError(401, "user does not exists.invalid credentials"));

  const user = await User.findById(verifiedToken._id);

  if (!user) return next(new AppError(404, "user does not exists"));

  const userData = {
    _id: user._id,
    email: user.email,
  };

  const { accessToken } = JWT.assignToken(userData, res);

  res.status(201).json({ accessToken });
});
