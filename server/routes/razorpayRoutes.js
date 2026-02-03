const express = require('express');
const router = express.Router();
const { createRazorpayOrder } = require('../controllers/razorpayController');
const { protect } = require('../middleware/authMiddleware');

// Create Razorpay order (UPI only)
router.post('/create-order', createRazorpayOrder);

module.exports = router;
