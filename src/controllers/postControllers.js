import Async from "../utils/Async.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import AppError from "../utils/Error/AppError.js";

export const createPost = Async(async function (req, res, next) {
  const body = req.body;

  const post = await new Post({
    author: body.author,
    tags: body.tags,
    text: body.text,
    title: body.title,
    image: body.image,
  }).save();

  await post.populate({ path: "author" });

  res.status(201).json(post);
});

export const updatePost = Async(async function (req, res, next) {
  const { postId } = req.params;
  const body = req.body;

  const updatedPost = await Post.findByIdAndUpdate(postId, body, {
    new: true,
  }).populate({ path: "author" });

  res.status(201).json(updatedPost);
});

export const deletePost = Async(async function (req, res, next) {
  const { postId } = req.params;

  await Post.findByIdAndDelete(postId);
  await Comment.deleteMany({ post: postId });

  res.status(201).json("post is deleted");
});

export const getPost = Async(async function (req, res, next) {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate({ path: "author" });

  if (!post) return next(new AppError(404, "post does not exists"));

  res.status(200).json(post);
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

    post.likeCount -= 1;
  } else {
    post.likes = [...post.likes, currentUser._id];

    post.likeCount += 1;
  }

  await post.save();

  res.status(201).json("reacted successfully");
});

export const getAllPosts = Async(async function (req, res, next) {
  const queryArray = generateQueryArray(req);

  const { pageLimit, skip, currentPage } = controlPagination(req);

  const total = await Post.find(
    queryArray[0] && { $or: queryArray }
  ).countDocuments();

  const numberOfPages = Math.ceil(total / pageLimit);

  const posts = await Post.find(queryArray[0] && { $or: queryArray })
    .skip(skip)
    .limit(pageLimit)
    .populate({ path: "author" })
    .sort("-createdAt");

  res.status(200).json({
    data: posts,
    total,
    currentPage,
    numberOfPages,
  });
});

export const searchPosts = Async(async function (req, res, next) {
  const queryArray = generateQueryArray(req);

  const { pageLimit, skip, currentPage } = controlPagination(req);

  const total = await Post.find({
    $or: queryArray,
  }).countDocuments();

  const numberOfPages = Math.ceil(total / pageLimit);

  const posts = await Post.find({
    $or: queryArray,
  })
    .skip(skip)
    .limit(pageLimit)
    .populate({ path: "author" })
    .sort("-createdAt");

  res.status(200).json({
    data: posts,
    total,
    currentPage,
    numberOfPages,
  });
});

export const getMemoriesByUser = Async(async function (req, res, next) {
  const { userId } = req.params;

  const posts = await Post.find({ author: userId }).populate({
    path: "author",
  });

  res.status(200).json(posts);
});

export const getUserLikedMemories = Async(async function (req, res, next) {
  const { userId } = req.params;

  const posts = await Post.find({ likes: userId }).populate({
    path: "author",
  });

  res.status(200).json(posts);
});

function generateQueryArray(req) {
  const { search, tags } = req.query;

  const queryArray = [];

  if (search) queryArray.push({ title: { $regex: search, $options: "i" } });

  if (tags)
    queryArray.push({
      tags: { $in: tags?.split(",").map((tag) => new RegExp(tag, "i")) },
    });

  return queryArray;
}

function controlPagination(req) {
  const { page, limit } = req.query;

  const pageLimit = +limit || 3;
  const currentPage = +page || 1;
  const skip = (currentPage - 1) * pageLimit;

  return { pageLimit, skip, currentPage };
}
