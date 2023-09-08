import express from "express";
import * as userController from "../controllers/userController.js";

const Router = express.Router();

Router.route("/:userId").get(userController.getUser);

export default Router;
