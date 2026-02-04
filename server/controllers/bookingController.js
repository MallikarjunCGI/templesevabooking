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
        sevaName,
        fullName,
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
            devotee.fullName = fullName;
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
                fullName: fullName,
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
            fullName,
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
        const nameFor = req.user ? req.user.name : (fullName || guestPhone || 'Guest');
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

    try {
        // BACKEND LOGGING: Log incoming booking request
        console.log('[BookingController] Incoming booking request:', req.body);
        // Fetch Seva details to allow a readable sevaName snapshot if not provided
        let sevaDetails = null;
        if (!sevaName && sevaId) {
            sevaDetails = await Seva.findById(sevaId);
        }

        // If user is logged in, fetch user details
        let user = null;
        if (req.user) {
            user = await User.findById(req.user._id);
        }

        // If devotee exists for phone, update their info
        let devotee = null;
        if (guestPhone) {
            devotee = await Devotee.findOne({ mobile: guestPhone });
            if (devotee) {
                devotee.fullName = fullName;
                devotee.gothram = gothram;
                devotee.rashi = rashi;
                devotee.nakshatra = nakshatra;
                devotee.guestEmail = guestEmail;
                devotee.state = state;
                devotee.district = district;
                devotee.taluk = taluk;
                devotee.pincode = pincode;
                devotee.place = place;
                devotee.fullAddress = address;
                await devotee.save();
            }
        }

        // Create booking
        const booking = new Booking({
            user: req.user ? req.user._id : undefined,
            seva: sevaId,
            sevaName: sevaName || (sevaDetails ? (sevaDetails.titleEn || sevaDetails.title) : undefined),
            fullName,
            gothram,
            rashi,
            nakshatra,
            guestEmail,
            guestPhone,
            bookingType,
            count,
            totalAmount,
            bookingDate,
            state,
            district,
            taluk,
            pincode,
            place,
            address,
            paymentMode,
            utrNumber
        });
        console.log('[BookingController] Booking document to save:', booking);
        await booking.save();

        // Send notification (optional)
        if (booking) {
            const nameFor = req.user ? req.user.name : (fullName || guestPhone || 'Guest');
            await Notification.create({
                type: 'booking',
                message: `New booking for ${sevaDetails ? (sevaDetails.titleEn || sevaDetails.title) : 'Seva'} by ${nameFor}`,
                booking: booking._id
            });
        }

        res.status(201).json(booking);
    } catch (error) {
        console.error('[BookingController] Booking creation failed:', error, error?.stack);
        res.status(500).json({ message: 'Booking creation failed', error: error.message, stack: error.stack });
    }