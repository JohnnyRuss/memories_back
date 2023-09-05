import express from "express";

// middlewares
import cookieparser from "cookieparser";
import { setHeaders, setHeaders } from "./middlewares";

// controllers
import errorController from "./controllers/errorController.js";

// utils
import { AppError } from "./utils/Error";

const App = express();

App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.use(setHeaders);
App.use(setCors);
App.use(cookieparser);

// Fetch unrecognized routes
App.all("*", (req, _, next) => {
  next(new AppError(404, `can't find ${req.originalUrl} on this server`));
});

App.use(errorController);

export default App;
