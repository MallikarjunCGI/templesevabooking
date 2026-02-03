// @desc    Create Razorpay Payment Link for UPI payment (branded QR)
// @route   POST /api/razorpay/create-payment-link
// @access  Public
exports.createRazorpayPaymentLink = async (req, res) => {
  try {
    const { amount, description, customer } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }
    const paymentLinkOptions = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      accept_partial: false,
      description: description || 'Temple Seva Payment',
      customer: customer || {},
      notify: { sms: true, email: true },
      reminder_enable: true,
      callback_url: '', // Optionally set for post-payment
      callback_method: 'get',
    };
    const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
    res.json({ success: true, paymentLink });
  } catch (error) {
    console.error('Razorpay payment link error:', error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};
const Razorpay = require('razorpay');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order for UPI payment
// @route   POST /api/razorpay/create-order
// @access  Public
exports.createRazorpayOrder = async (req, res) => {
    console.log('Razorpay create-order req.body:', req.body);
    console.log('Headers:', req.headers);
    console.log('Method:', req.method);
    console.log('typeof req.body:', typeof req.body);
  try {
    const { amount, receipt } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }
    // Ensure receipt is max 40 chars for Razorpay
    let shortReceipt = receipt || `rcpt_${Date.now()}`;
    if (shortReceipt.length > 40) {
      // Keep prefix and last 10 digits of timestamp
      shortReceipt = shortReceipt.slice(0, 20) + '_' + Date.now().toString().slice(-10);
      shortReceipt = shortReceipt.slice(0, 40); // Final safety trim
    }
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: shortReceipt,
      payment_capture: 1,
      method: 'upi',
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    if (error.response) {
      console.error('Razorpay error response:', error.response.data);
    }
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};
