const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Seva = require('../models/Seva');
const Razorpay = require('razorpay'); // 1. Import Razorpay

// 2. Initialize Razorpay with your Test Credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Add a console log here to debug (remove after it works)
if (!process.env.RAZORPAY_KEY_ID) {
    console.error("FATAL ERROR: RAZORPAY_KEY_ID is missing from .env file");
}

// @desc    Create new booking with Razorpay Order
// @route   POST /api/bookings
// @access  Private/Guest
const createBooking = asyncHandler(async (req, res) => {
    const {
        sevaId,
        devoteeName,
        gothram,
        rashi,
        nakshatra,
        bookingType,
        count,
        totalAmount,
        guestName,
        guestEmail,
        guestPhone,
        bookingDate
    } = req.body;

    if (!sevaId) {
        res.status(400);
        throw new Error('No seva selected');
    }

    try {
        // 3. Create Razorpay Order
        // Note: amount must be in the smallest currency unit (paise for INR)
        const options = {
            amount: Number(totalAmount) * 100, 
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // 4. Create the Booking document in MongoDB
        const booking = new Booking({
            user: req.user ? req.user._id : null,
            guestName: req.user ? req.user.name : guestName,
            guestEmail: req.user ? req.user.email : guestEmail,
            guestPhone: req.user ? req.user.phone : guestPhone,
            seva: sevaId,
            devoteeName,
            gothram,
            rashi,
            nakshatra,
            bookingDate: bookingDate || Date.now(),
            bookingType,
            count,
            totalAmount,
            razorpayOrderId: razorpayOrder.id, // Store the official Order ID
            isPaid: false, // Set to false initially; update via Webhook or Handler
            status: 'Pending'
        });

        const createdBooking = await booking.save();

        // 5. Respond with both the Booking and the Razorpay Order details
        res.status(201).json({
            success: true,
            booking: createdBooking,
            razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency
            }
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500);
        throw new Error('Could not initiate payment. Please try again.');
    }
});
// @desc    Get all bookings (Admin)
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({});
  res.json(bookings);
});

// @desc    Update booking (Admin)
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  booking.status = req.body.status || booking.status;
  const updatedBooking = await booking.save();

  res.json(updatedBooking);
});

// @desc    Delete booking (Admin)
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  await booking.deleteOne();
  res.json({ message: 'Booking removed' });
});

// @desc    Get bookings by phone (Guest tracking)
const getBookingsByPhone = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ guestPhone: req.params.phone });
  res.json(bookings);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ guestPhone: req.params.phone });
  res.json(bookings);
});

module.exports = {
    createBooking,
    getMyBookings,
    getBookings,
    updateBooking,
    deleteBooking,
    getBookingsByPhone,
};