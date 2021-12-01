require("../db/conn");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Liked = require("../models/liked");
const ObjectId = require("mongodb").ObjectId;

exports.createPost = async (req, res, next) => {
  try {
    const userEmail = req.loggedInUser.email;
    console.log(userEmail);
    const userData = await User.findOne({
      where: { email: userEmail }
    });
    console.log(userData);
    const userId = new ObjectId(userData);
    //const userId = req.params.userId;

    const { title, images, caption } = req.body;

    if (!title || !images || !caption) {
      return res
        .status(403)
        .json({ alert: "Please fill all the fields properly!" });
    }

    //await Post.create({ userId, title, images, caption});

    return res
      .status(201)
      .json({ message: `Post created successfully by ${userData.name}.` });
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

    const userData = await User.findOne({ email: req.loggedInUser.email });
    const userId = new ObjectId(userData);

    const { comments } = req.body;

    const postExist = await Post.findById({ _id: postId });
    const userExist = await User.findById({ _id: userId });
    const user = await User.findById({ _id: postExist.userId });

    if (!comments) {
      return res
        .status(403)
        .json({ alert: "Please fill all the fields properly!" });
    }

    if (!postExist || !userExist) {
      return res.status(403).json({ error: "Post is not available anymore!" });
    }

    await Comment.create({ userId, postId, comments });

    return res.status(201).json({
      message: `Commented created successfully by ${userExist.name} on the post of ${user.name}`,
    });
  } catch (error) {
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

// exports.findAllPostComment = async (req, res, next) => {
//     try {
//         const { offset, limit} = req.query;

//         const query = {
//             attributes: ["title", "images", "caption", "createdAt"],
//             include: [
//                 {
//                     model: Comment,
//                     attributes: ["comments", "createdAt"]
//                 }
//             ],
//             limit,
//             offset
//         };

//         const data = await Post.find(query);
//         console.log(data);

//         return res.status(200).json({data});
//     } catch (error) {
//         next(error);
//     }
// };

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
      .select("comments")
      .populate({ path: "postId", select: ["title", "images", "createdAt"] });

    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

exports.checkedLiked = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const userData = await User.findOne({ email: req.loggedInUser.email });
    const userId = new ObjectId(userData);

    const { checked } = req.body;

    if (!checked) {
      return res
        .status(403)
        .json({ alert: "Please fill the fields properly!" });
    }

    const likedExist = await Liked.findOne({ postId, userId });

    if (likedExist) {
      return res.status(403).json({ error: "Post already liked!" });
    } else {
      await Liked.create({ userId, postId, checked });

      const post = await Post.findById({ _id: postId });
      const postUser = await User.findById({ _id: post.userId });
      const user = await User.findById({ _id: userId });

      return res
        .status(201)
        .json({ message: `${postUser.name} post is liked by ${user.name}` });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    const likeId = req.params.likeId;
    const { checked } = req.body;

    const likedExist = await Liked.findById({ _id: likeId });

    if (!likedExist) {
      return res.status(403).json({ error: "Something went wrong!" });
    }

    if (checked === false) {
      await likedExist.delete();
    } else {
      return res.status(402).json({ error: "Something went wrong here!" });
    }

    return res.status(200).json({ message: "Like deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
