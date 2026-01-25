const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Seva = require('../models/Seva');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
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
        throw new Error('No seva items');
    } else {
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
            isPaid: true, // Mocking payment success for now
            status: 'Confirmed'
        });

        const createdBooking = await booking.save();

        // Fetch Seva for notification message
        const sevaDetails = await Seva.findById(sevaId);

        // Create Notification for Admin
        await Notification.create({
            type: 'booking',
            message: `New booking for ${sevaDetails ? sevaDetails.title : 'Seva'} by ${req.user ? req.user.name : (guestName || 'Guest')}`,
            bookingId: createdBooking._id
        });

        res.status(201).json(createdBooking);
    }
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('seva', 'titleEn titleKn templeNameEn templeNameKn locationEn locationKn');
    res.json(bookings);
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({}).populate('user', 'id name email').populate('seva', 'titleEn titleKn templeNameEn templeNameKn locationEn locationKn');
    res.json(bookings);
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        booking.devoteeName = req.body.devoteeName || booking.devoteeName;
        booking.gothram = req.body.gothram || booking.gothram;
        booking.rashi = req.body.rashi || booking.rashi;
        booking.nakshatra = req.body.nakshatra || booking.nakshatra;
        booking.bookingDate = req.body.bookingDate || booking.bookingDate;
        booking.status = req.body.status || booking.status;
        booking.guestName = req.body.guestName || booking.guestName;
        booking.guestEmail = req.body.guestEmail || booking.guestEmail;
        booking.guestPhone = req.body.guestPhone || booking.guestPhone;

        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        await booking.deleteOne();
        res.json({ message: 'Booking removed' });
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

// @desc    Get bookings by guest phone number
// @route   GET /api/bookings/track/:phone
// @access  Public
const getBookingsByPhone = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ guestPhone: req.params.phone })
        .populate('seva', 'titleEn titleKn templeNameEn templeNameKn locationEn locationKn image')
        .sort('-createdAt');
    res.json(bookings);
});

module.exports = { createBooking, getMyBookings, getBookings, updateBooking, deleteBooking, getBookingsByPhone };