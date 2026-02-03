const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Seva = require('../models/Seva');
const razorpay = require('../utils/razorpay');
const crypto = require('crypto');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
    const {
        sevaId,
        sevaName,
        devoteeName,
        gothram,
        bookingType,
        count,
        totalAmount,
        guestPhone,
        bookingDate,
        // Location fields
        state,
        district,
        taluk,
        pincode,
        place,
        address,
        paymentMode
    } = req.body;

    if (!sevaId) {
        res.status(400);
        throw new Error('No seva items');
    } else {
        const Devotee = require('../models/Devotee');
        // Fetch Seva details to allow a readable sevaName snapshot if not provided
        const sevaDetails = await Seva.findById(sevaId);

        // Next sequential receipt number (1, 2, 3, ...)
        const lastBooking = await Booking.findOne().sort('-receiptNo').select('receiptNo').lean();
        const receiptNo = (lastBooking && lastBooking.receiptNo != null) ? lastBooking.receiptNo + 1 : 1;

        // Upsert devotee
        let devotee = await Devotee.findOne({ mobile: guestPhone });
        if (devotee) {
            devotee.fullName = devoteeName;
            devotee.gothram = gothram || devotee.gothram;
            devotee.state = state || devotee.state;
            devotee.district = district || devotee.district;
            devotee.taluk = taluk || devotee.taluk;
            devotee.pincode = pincode || devotee.pincode;
            devotee.place = place || devotee.place;
            devotee.fullAddress = address || devotee.fullAddress;
            devotee.totalAmountSpent += Number(totalAmount) || 0;
            devotee.sevaCount += 1;
            await devotee.save();
        } else {
            devotee = new Devotee({
                mobile: guestPhone,
                fullName: devoteeName,
                gothram,
                state,
                district,
                taluk,
                pincode,
                place,
                fullAddress: address,
                totalAmountSpent: Number(totalAmount) || 0,
                sevaCount: 1
            });
            await devotee.save();
        }

        const booking = new Booking({
            user: req.user ? req.user._id : null,
            guestPhone: guestPhone || (req.user ? req.user.phone : null),
            seva: sevaId,
            sevaName: sevaName || (sevaDetails ? (sevaDetails.titleEn || sevaDetails.title) : undefined),
            devoteeName,
            gothram: gothram || undefined,
            receiptNo,
            state,
            district,
            taluk,
            pincode,
            place,
            address,
            paymentMode,
            bookingDate: bookingDate || Date.now(),
            bookingType,
            count,
            totalAmount,
            isPaid: true, // Mocking payment success for now
            status: 'Confirmed',
            utrNumber: req.body.utrNumber || undefined
        });

        const createdBooking = await booking.save();

        // Create Notification for Admin
        const nameFor = req.user ? req.user.name : (devoteeName || guestPhone || 'Guest');
        await Notification.create({
            type: 'booking',
            message: `New booking for ${sevaDetails ? (sevaDetails.titleEn || sevaDetails.title) : 'Seva'} by ${nameFor}`,
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
        // update contact phone if provided
        booking.guestPhone = req.body.guestPhone || booking.guestPhone;
        // Location and additional editable fields
        booking.state = req.body.state || booking.state;
        booking.district = req.body.district || booking.district;
        booking.taluk = req.body.taluk || booking.taluk;
        booking.pincode = req.body.pincode || booking.pincode;
        booking.place = req.body.place || booking.place;
        booking.address = req.body.address || booking.address;
        booking.paymentMode = req.body.paymentMode || booking.paymentMode;
        // Allow changing seva/sevaName and totalAmount if provided
        if (req.body.seva) booking.seva = req.body.seva;
        if (req.body.sevaName) booking.sevaName = req.body.sevaName;
        if (req.body.totalAmount !== undefined) booking.totalAmount = req.body.totalAmount;
        if (typeof req.body.photoOrderCompleted === 'boolean') booking.photoOrderCompleted = req.body.photoOrderCompleted;

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