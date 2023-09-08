import {
  NODE_ENV,
  APP_ORIGINS,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../config/env.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

class JWT {
  assignToken({ payload, res }) {
    const userPayload = {
      _id: payload._id,
      email: payload.email,
    };

    const accessToken = jwt.sign(userPayload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(userPayload, REFRESH_TOKEN_SECRET);

    const cookieOptions = {
      secure: false,
      httpOnly: true,
      sameSite: "none",
      origin: APP_ORIGINS,
    };

    if (NODE_ENV !== "DEV") cookieOptions.secure = true;

    res.cookie("authorization", refreshToken, cookieOptions);

    return { accessToken };
  }

  async verifyToken({ token, refreshToken }) {
    try {
      const validator = promisify(jwt.verify);

      return await validator(
        token,
        refreshToken ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new JWT();
