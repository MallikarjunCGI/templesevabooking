const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    templeName: { type: String, required: true, default: 'One Temple' },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    address: { type: String, required: true },
    website: { type: String },
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'IST (UTC+5:30)' },
    ritualHours: { type: String, default: '06:00 AM - 08:00 PM' },
    allowSameDayBooking: { type: Boolean, default: true },
    notifyDevotee: { type: Boolean, default: true },
    bookingPreferences: {
        advanceBookingDays: {
            type: Number,
            default: 30
        },
        cancellationAllowed: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);

