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

export const getPosts = Async(async function (req, res, next) {
  const posts = await Post.find();
  res.status(200).json(posts);
});
