const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public (or Private)
const getSettings = asyncHandler(async (req, res) => {
    const settings = await Settings.findOne();
    if (settings) {
        res.json(settings);
    } else {
        // Return defaults if not found
        res.json({
            templeName: 'Shree Kshetra Ramtirtha',
            contactEmail: 'contact@temple.com',
            contactPhone: '+91 99999 99999',
            address: 'Temple Address',
            currency: 'INR',
            timezone: 'IST',
            ritualHours: '06:00 AM - 08:00 PM',
            allowSameDayBooking: true,
            notifyDevotee: true,
            upiId: 'yourname@upi'
        });
    }
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();

    if (settings) {
        settings.templeName = req.body.templeName || settings.templeName;
        settings.contactEmail = req.body.contactEmail || settings.contactEmail;
        settings.contactPhone = req.body.contactPhone || settings.contactPhone;
        settings.address = req.body.address || settings.address;
        settings.website = req.body.website || settings.website;
        settings.currency = req.body.currency || settings.currency;
        settings.ritualHours = req.body.ritualHours || settings.ritualHours;
        settings.allowSameDayBooking = req.body.allowSameDayBooking !== undefined ? req.body.allowSameDayBooking : settings.allowSameDayBooking;
        settings.notifyDevotee = req.body.notifyDevotee !== undefined ? req.body.notifyDevotee : settings.notifyDevotee;
        settings.upiId = req.body.upiId || settings.upiId;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else {
        // Create if not exists
        const newSettings = await Settings.create(req.body);
        res.status(201).json(newSettings);
    }
});

module.exports = { getSettings, updateSettings };