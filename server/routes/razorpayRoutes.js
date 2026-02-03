const express = require('express');
const router = express.Router();
const { createRazorpayOrder, createRazorpayPaymentLink } = require('../controllers/razorpayController');
// Create Razorpay Payment Link (branded QR)
router.post('/create-payment-link', createRazorpayPaymentLink);
const { protect } = require('../middleware/authMiddleware');

// Create Razorpay order (UPI only)
router.post('/create-order', createRazorpayOrder);

module.exports = router;
