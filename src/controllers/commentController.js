import Async from "../utils/Async.js";
import AppError from "../utils/Error/AppError.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const addComment = Async(async (req, res, next) => {
  const { postId } = req.params;
  const { text } = req.body;

  const currentUser = req.user;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError(404, "post does not exists"));

  if (!text) return next(new AppError(400, "please enter some text"));

  const newComment = await Comment.create({
    post: postId,
    author: currentUser._id,
    text,
  });

  const comment = await Comment.findById(newComment._id).populate({
    path: "author",
    select: "name",
  });

  res.status(201).json(comment);
});

export const getPostComments = Async(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError(404, "post does not exists"));

  const comments = await Comment.find({ post: postId }).populate({
    path: "author",
    select: "name",
  });

  res.status(200).json(comments);
});

export const updateComment = Async(async (req, res, next) => {
  res.status().json("");
});

export const deleteComment = Async(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) return next(new AppError(404, "comment does not exists"));

  res.status(204).json("comment is deleted");
});

export const reactOnComment = Async(async (req, res, next) => {
  const { commentId } = req.params;
  const currentUser = req.user;

  const comment = await Comment.findById(commentId).populate({
    path: "author",
    select: "name",
  });

  if (!comment) return next(new AppError(404, "comment does not exists"));

  const isLikedComment = comment.likes.some(
    (author) => author.toString() === currentUser._id
  );

  if (isLikedComment) {
    comment.likesCount -= 1;
    comment.likes = comment.likes.filter(
      (author) => author.toString() !== currentUser._id
    );
  } else {
    comment.likesCount += 1;
    comment.likes.push(currentUser._id);
  }

  await comment.save();

  res.status(201).json(comment);
});
