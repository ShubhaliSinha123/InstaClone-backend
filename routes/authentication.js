const router = require('express').Router();

const { login } = require('../controllers/authentication');

router.post(
    '/login',
    login
);

module.exports = router;