import App from "./app.js";
import mongoose from "mongoose";
import { createServer } from "http";
import { PORT, DB_APP_CONNECTION } from "./config/env.js";

const SERVER = createServer(App);

const shutdown = async () => {
  try {
    await mongoose.connection.close();
    SERVER.close(() => {
      console.log(
        "Server is CLOSED and Process is exited with status code 0 ❌"
      );
      process.exit(0);
    });
  } catch (error) {
    console.error(
      "Ocurred Error during shutdown 💥 ❌. See te error 👉🏻",
      error
    );
    process.exit(1);
  }
};

process.on("uncaughtException", (error) => shutdown());

(async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(DB_APP_CONNECTION);

  console.log("DB is connected successfully ♻ ✔");

  SERVER.listen(PORT, () => {
    console.log(`App listens on PORT:${PORT} 👀 ✔`);
  });
})();

process.on("unhandledRejection", (error) => shutdown());

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
