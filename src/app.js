import express from "express";

// middlewares
import cookieparser from "cookie-parser";
import morgan from "morgan";

// custom middlewares
import setCors from "./middlewares/setCors.js";
import setHeaders from "./middlewares/setHeaders.js";

// controllers
import errorController from "./controllers/errorController.js";

// utils
import AppError from "./utils/Error/AppError.js";

// routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

import { NODE_ENV } from "./config/env.js";

const App = express();

App.use(express.json({ limit: "30mb" }));
App.use(express.urlencoded({ extended: true, limit: "30mb" }));

App.use(setHeaders);
App.use(setCors());
App.use(cookieparser());

NODE_ENV === "DEV" && App.use(morgan("dev"));

App.use("/api/v1/auth", authRoutes);
App.use("/api/v1/user", userRoutes);
App.use("/api/v1/posts", postRoutes);

// Fetch unrecognized routes
App.all("*", (req, _, next) => {
  next(new AppError(404, `can't find ${req.originalUrl} on this server`));
});

App.use(errorController);

export default App;
