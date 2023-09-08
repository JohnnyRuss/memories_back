import Async from "../utils/Async.js";
import Post from "../models/Post.js";

export const createPost = Async(async function (req, res, next) {
  const body = req.body;

  const post = await new Post({
    author: body.author,
    tags: body.tags,
    text: body.text,
    title: body.title,
    image: body.image,
  }).save();

  res.status(201).json(post);
});

export const updatePost = Async(async function (req, res, next) {
  res.status(201).json("db post update");
});

export const deletePost = Async(async function (req, res, next) {
  res.status(201).json("db post update");
});

export const getPost = Async(async function (req, res, next) {
  res.status(201).json("db post update");
});

export const reactOnPost = Async(async function (req, res, next) {
  const { postId } = req.params;
  const currentUser = req.user;

  const post = await Post.findById(postId);

  const isExistingReaction = post.likes.some(
    (reaction) => reaction.toString() === currentUser._id
  );

  if (isExistingReaction) {
    post.likes = post.likes.filter(
      (reaction) => reaction.toString() !== currentUser._id
    );

    post.likeCount += 1;
  } else {
    post.likes = [...post.likes, currentUser._id];

    post.likeCount -= 1;
  }

  await post.save();

  res.status(201).json("reacted successfully");
});

export const getAllPosts = Async(async function (req, res, next) {
  const posts = await Post.find();
  res.status(200).json(posts);
});
