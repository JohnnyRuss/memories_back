import express from "express";
import * as postController from "../controllers/postControllers.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const Router = express.Router();

Router.route("/")
  .get(postController.getAllPosts)
  .post(checkAuth, postController.createPost);

Router.route("/search").get(postController.searchPosts);

Router.route("/:postId")
  .put(checkAuth, postController.updatePost)
  .delete(checkAuth, postController.deletePost)
  .get(postController.getPost);

Router.route("/:postId/reaction").patch(checkAuth, postController.reactOnPost);

export default Router;
