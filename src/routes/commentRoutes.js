import * as commentsController from "../controllers/commentController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import express from "express";

const Router = express.Router();

Router.route("/:commentId")
  .delete(checkAuth, commentsController.deleteComment)
  .put(checkAuth, commentsController.updateComment);

Router.route("/post/:postId")
  .get(commentsController.getPostComments)
  .post(checkAuth, commentsController.addComment);

Router.route("/:commentId/reaction").patch(
  checkAuth,
  commentsController.reactOnComment
);

export default Router;
