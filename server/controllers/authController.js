const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change own password
// @route   PUT /api/auth/change-password
// @access  Private
const changeOwnPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Current password and new password are required');
    }
    const match = await user.matchPassword(currentPassword);
    if (!match) {
        res.status(401);
        throw new Error('Current password is incorrect');
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
});

// @desc    List users (admin only) - for password management
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('name email role createdAt').sort('-createdAt');
    res.json(users);
});

// @desc    Set user password (admin only)
// @route   PUT /api/auth/users/:userId/password
// @access  Private/Admin
const setUserPassword = asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
        res.status(400);
        throw new Error('New password is required and must be at least 6 characters');
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
});

module.exports = { authUser, registerUser, changeOwnPassword, getUsers, setUserPassword };
