const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User',
        },
        guestName: { type: String },
        guestEmail: { type: String },
        guestPhone: { type: String },
        seva: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Seva',
        },
        devoteeName: { type: String, required: true },
        gothram: { type: String, required: false },
        rashi: { type: String, required: false },
        nakshatra: { type: String, required: false },
        bookingDate: { type: Date, default: Date.now },
        bookingType: { type: String, required: true }, // individual, family
        count: { type: Number, default: 1 },
        totalAmount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        // --- NEW FIELDS FOR RAZORPAY ---
        razorpayOrderId: {
            type: String,
            required: false, // Set to true if you want every booking to have an order
        },
        razorpayPaymentId: {
            type: String, // Useful for storing the actual transaction ID after success
            required: false,
        },
        // -------------------------------
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        status: {
            type: String,
            default: 'Pending', // Pending, Confirmed, Completed
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;