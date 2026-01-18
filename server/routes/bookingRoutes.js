const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookings, updateBooking, deleteBooking, getBookingsByPhone } = require('../controllers/bookingController');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');

router.route('/').post(optionalProtect, createBooking).get(getBookings);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/track/:phone').get(getBookingsByPhone);
router.route('/:id').put(protect, admin, updateBooking).delete(protect, admin, deleteBooking);

module.exports = router;
