const express = require('express');
const router = express.Router();
const Devotee = require('../models/Devotee');
const asyncHandler = require('express-async-handler');

// @desc    Get devotee by mobile number
// @route   GET /api/devotees/:mobile
// @access  Public
router.get('/:mobile', asyncHandler(async (req, res) => {
    const devotee = await Devotee.findOne({ mobile: req.params.mobile });
    if (devotee) {
        res.json(devotee);
    } else {
        res.status(404).json({ message: 'Devotee not found' });
    }
}));

module.exports = router;
