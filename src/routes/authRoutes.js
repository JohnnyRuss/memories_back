import express from "express";
import * as authController from "../controllers/authController.js";

const Router = express.Router();

Router.route("/register").post(authController.registerUser);

Router.route("/login").post(authController.loginUser);

Router.route("/logout").post(authController.logoutUser);

Router.route("/refresh").post(authController.refresh);

export default Router;
