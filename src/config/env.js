import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const NODE_ENV = process.env.NODE_ENV;

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_APP_CONNECTION_URI = process.env.DB_APP_CONNECTION;

const DB_APP_CONNECTION = DB_APP_CONNECTION_URI.replace(
  "<password>",
  DB_PASSWORD
);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
const CLIENT_DEV_ORIGIN = process.env.CLIENT_DEV_ORIGIN;
const APP_ORIGINS = [CLIENT_ORIGIN, CLIENT_DEV_ORIGIN];

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN;

export {
  PORT,
  NODE_ENV,
  DB_APP_CONNECTION,
  APP_ORIGINS,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
};
