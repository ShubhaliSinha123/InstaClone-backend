const router = require("express").Router();

const {
  createUser,
  updateUser,
  deleteUser,
  findAndCountUser,
  logoutUser
} = require("../controllers/user");

const verified = require("../middleware/verify");
const { canAccess } = require("../middleware/access");

router
.post(
    '/register',
    canAccess('anyone'),
    createUser
)
.post(
    '/update-user',
    verified,
    canAccess('client'),
    updateUser
)
.delete(
    '/delete-user/:userId',
    verified,
    canAccess(['admin', 'client']),
    deleteUser
)
.get(
    '/find-and-count-user',
    verified,
    canAccess('admin'),
    findAndCountUser
)
.delete(
    '/logout-user',
    verified,
    canAccess('client'),
    logoutUser
)

module.exports = router;
