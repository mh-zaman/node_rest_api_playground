const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check_auth');
const userController = require('../controllers/users');

router.get('/', checkAuth, userController.get_all_users);

router.get('/:userId', checkAuth, userController.get_user);

router.post('/signup', userController.sign_up);

router.post('/login', userController.log_in);

router.delete('/:userId', userController.delete_user);

module.exports = router;