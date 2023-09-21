const router = require('express').Router();

const {
  createPost,
  deletePost,
  createComment,
  findAllPostCommentById,
  findAllCommentById,
  checkedLiked,
  deleteLike,
  deleteComment,
  findAllPostComments,
  findAllPostUser,
  findAllPostsByUserId,
  getNotifications,
  onSearch,
} = require('../controllers/common');

const verified = require('../middleware/verify');
const { canAccess } = require('../middleware/access');

router
  .post('/create-post', verified, canAccess('client'), createPost)
  .post('/create-comment/:postId', verified, canAccess('anyone'), createComment)
  .get(
    '/post-comments/:postId',
    verified,
    canAccess('client'),
    findAllPostCommentById
  )
  .get('/comments/:postId', verified, canAccess('client'), findAllCommentById)
  .get('/all-posts', verified, canAccess(['client']), findAllPostComments)
  .get('/all-user-posts', verified, canAccess('client'), findAllPostsByUserId)
  .delete(
    '/delete-post/:postId',
    verified,
    canAccess(['admin', 'client']),
    deletePost
  )
  .post(
    '/update-like-status/:postId',
    verified,
    canAccess(['client']),
    checkedLiked
  )
  .delete(
    '/delete-comment/:commentId',
    verified,
    canAccess('anyone'),
    deleteComment
  )
  .get('/all-posts', verified, canAccess(['anyone']), findAllPostUser)
  .get('/notifications', verified, canAccess(['anyone']), getNotifications)
  .post('/search', verified, canAccess('anyone'), onSearch);

module.exports = router;
