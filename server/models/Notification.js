const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['booking', 'system'],
        default: 'booking'
    },
    message: { type: String, required: true },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
