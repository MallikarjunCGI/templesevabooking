const express = require('express');
const router = express.Router();
const { getDevotees, getDevoteeByMobile, updateDevotee, deleteDevotee } = require('../controllers/devoteeController');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    List all devotees (admin)
// @route   GET /api/devotees
// @access  Private/Admin
router.route('/').get(protect, admin, getDevotees);

// @desc    Get devotee by mobile number
// @route   GET /api/devotees/:mobile
// @access  Public
router.route('/:mobile').get(getDevoteeByMobile);

// @desc    Update/Delete devotee (admin)
// @route   PUT/DELETE /api/devotees/:id
// @access  Private/Admin
router.route('/:id').put(protect, admin, updateDevotee).delete(protect, admin, deleteDevotee);

module.exports = router;
