const router = require("express").Router();

const {
  createPost,
  deletePost,
  createComment,
  findAllPostCommentById,
  findAllCommentById,
  checkedLiked,
  deleteLike,
  deleteComment
} = require("../controllers/common");

const verified = require("../middleware/verify");
const { canAccess } = require("../middleware/access");

router
  .post(
    "/create-post", 
    verified, 
    canAccess("anyone"), 
    createPost)
  .post(
    "/create-comment/:postId",
    verified,
    canAccess("anyone"),
    createComment)
  .get(
    "/find-all-post-comments/:postId",
    verified,
    canAccess("client"),
    findAllPostCommentById)
  .get(
    "/find-all-comments/:postId",
    verified,
    canAccess("client"),
    findAllCommentById)
  .delete(
    "/delete-post/:postId",
    verified,
    canAccess(["admin", "client"]),
    deletePost)
  .post(
    "/liked-post/:postId",
    verified,
    canAccess(["client"]),
    checkedLiked)
  .delete(
    "/delete-like/:likeId",
    verified,
    canAccess('client'),
    deleteLike)
  .delete(
    "/delete-comment/:commentId",
    verified,
    canAccess('anyone'),
    deleteComment
  )

module.exports = router;
