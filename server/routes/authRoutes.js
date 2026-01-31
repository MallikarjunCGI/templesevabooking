const express = require('express');
const router = express.Router();
const { authUser, registerUser, changeOwnPassword, getUsers, setUserPassword } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.put('/change-password', protect, changeOwnPassword);
router.get('/users', protect, admin, getUsers);
router.put('/users/:userId/password', protect, admin, setUserPassword);

module.exports = router;
