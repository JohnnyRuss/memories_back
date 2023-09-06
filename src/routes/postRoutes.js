import express from "express";
import * as postController from "../controllers/postControllers.js";

const Router = express.Router();

Router.route("/").get(postController.getPosts).post(postController.createPost);

export default Router;
