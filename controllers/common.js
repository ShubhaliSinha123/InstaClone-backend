require("../db/conn");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Liked = require("../models/liked");
const ObjectId = require("mongodb").ObjectId;

exports.createPost = async (req, res, next) => {
  try {
    const userId = await req.loggedInUser.id;

    const user = await User.findById({ _id: userId });

    const { title, images, caption } = req.body;

    if (!title || !images || !caption) {
      return res
        .status(403)
        .json({ alert: "Please fill all the fields properly!" });
    }

    await Post.create({ userId, title, images, caption, alt: `${images}` });

    return res
      .status(201)
      .json({ message: `Post created successfully by ${user.name}.` });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const id = req.params.postId;

    const postExist = await Post.findById({ _id: id });

    if (!postExist) {
      return res.status(404).json({ error: "Post doesn't exist anymore!" });
    }

    await postExist.delete();

    return res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const userId = await req.loggedInUser.id;

    const { comments } = req.body;

    const postExist = await Post.findById({ _id: postId });

    const userExist = await User.findById({ _id: userId });
    const postUser = await User.findOne({ _id: postExist.userId });

    if (!comments) {
      return res
        .status(405)
        .json({ alert: "Please fill all the fields properly!" });
    }

    if (!postExist || !userExist) {
      return res.status(403).json({ error: "Post is not available anymore!" });
    }

    const comment = await Comment.create({ userId, postId, comments });

    await Post.findOneAndUpdate(
      { _id: postId },
      {
        $push: { comments: comment },
      },
      { new: true }
    );

    return res.status(201).json({
      message: `Commented created successfully by ${userExist.name} on the post of ${postUser.name}`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const id = req.params.commentId;

    const commentExist = await Comment.findById({ _id: id });

    if (!commentExist) {
      return res.status(403).json({ error: "Comment doesn't exist anymore!" });
    }

    await commentExist.delete();

    return res.status(200).json({ message: "Comment deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

exports.findAllPostUser = async (req, res, next) => {
  try {
    const data = await Post.find();

    if (!data) {
      return res.status(404).json({ message: "Not posts yet!" });
    }
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.findAllPostCommentById = async (req, res, next) => {
  try {
    const id = req.params.postId;
    const data = await Comment.find({ postId: id })
      .select("comments")
      .populate({ path: "userId", select: ["name"] })
      .populate({ path: "postId", select: ["title", "createdAt"] });

    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

exports.findAllCommentById = async (req, res, next) => {
  try {
    const id = req.params.postId;

    const data = await Comment.find({ postId: id })
      .select("comments", "_id")
      .populate({ path: "postId", select: ["title", "images", "createdAt"] });

    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

exports.findAllPostComments = async (req, res, next) => {
  try {
    const data = await Post.find()
      .select(["title", "images", "caption", "comments", "createdAt", "alt"])
      .sort([["createdAt", -1]])
      .populate({
        path: "userId",
        select: ["name", "email", "role"],
      })
      .populate({
        path: "comments",
      })
      .populate({
        path: "userId",
      });

    return res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
};

exports.checkedLiked = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const userData = await User.findOne({ email: req.loggedInUser.email });
    const userId = new ObjectId(userData);

    const likedExist = await Liked.findOne({ postId, userId });

    if (likedExist) {
      await likedExist.delete();
      return res
        .status(200)
        .json({ message: "unlike post successfully!", checked: false });
    } else {
      await Liked.create({ userId, postId, checked: true });

      const post = await Post.findById({ _id: postId });
      const postUser = await User.findById({ _id: post.userId });
      const user = await User.findById({ _id: userId });

      return res.status(201).json({
        message: `${postUser.name} post is liked by ${user.name}`,
        checked: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.findAllPostsByUserId = async (req, res, next) => {
  try {
    const userId = await req.loggedInUser.id;

    const data = await Post.find({ userId })
      .select(["title", "images", "caption", "comments", "createdAt", "alt"])
      .sort([["createdAt", -1]]);

    return res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
};
