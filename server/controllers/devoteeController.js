const asyncHandler = require('express-async-handler');
const Devotee = require('../models/Devotee');
const Booking = require('../models/Booking');

// @desc    List all devotees (admin)
// @route   GET /api/devotees
// @access  Private/Admin
const getDevotees = asyncHandler(async (req, res) => {
    const devotees = await Devotee.find({}).sort('-totalAmountSpent');
    res.json(devotees);
});

// @desc    Get devotee by mobile number
// @route   GET /api/devotees/:mobile
// @access  Public
const getDevoteeByMobile = asyncHandler(async (req, res) => {
    const devotee = await Devotee.findOne({ mobile: req.params.mobile });
    if (devotee) {
        res.json(devotee);
    } else {
        res.status(404).json({ message: 'Devotee not found' });
    }
});

// @desc    Update devotee (admin)
// @route   PUT /api/devotees/:id
// @access  Private/Admin
const updateDevotee = asyncHandler(async (req, res) => {
    const devotee = await Devotee.findById(req.params.id);
    if (!devotee) {
        res.status(404);
        throw new Error('Devotee not found');
    }

    const {
        mobile,
        fullName,
        gothram,
        state,
        district,
        taluk,
        pincode,
        place,
        fullAddress
    } = req.body;

    if (mobile && mobile !== devotee.mobile) {
        const existing = await Devotee.findOne({ mobile });
        if (existing && String(existing._id) !== String(devotee._id)) {
            res.status(400);
            throw new Error('Mobile number already exists');
        }
        await Booking.updateMany({ guestPhone: devotee.mobile }, { $set: { guestPhone: mobile } });
        devotee.mobile = mobile;
    }

    if (fullName !== undefined) devotee.fullName = fullName;
    if (gothram !== undefined) devotee.gothram = gothram;
    if (state !== undefined) devotee.state = state;
    if (district !== undefined) devotee.district = district;
    if (taluk !== undefined) devotee.taluk = taluk;
    if (pincode !== undefined) devotee.pincode = pincode;
    if (place !== undefined) devotee.place = place;
    if (fullAddress !== undefined) devotee.fullAddress = fullAddress;

    const updated = await devotee.save();
    res.json(updated);
});

// @desc    Delete devotee (admin)
// @route   DELETE /api/devotees/:id
// @access  Private/Admin
const deleteDevotee = asyncHandler(async (req, res) => {
    const devotee = await Devotee.findById(req.params.id);
    if (!devotee) {
        res.status(404);
        throw new Error('Devotee not found');
    }
    await devotee.deleteOne();
    res.json({ message: 'Devotee removed' });
});

module.exports = { getDevotees, getDevoteeByMobile, updateDevotee, deleteDevotee };
