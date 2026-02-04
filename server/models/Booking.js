const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User',
        },
        // Contact info for receipt/notification
        guestName: { type: String },
        guestEmail: { type: String },
        guestPhone: { type: String },
        
        // Seva link
        seva: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Seva',
        },
        // Human readable seva name snapshot
        sevaName: {
            type: String,
        },

        // Devotee Details (Primary Full Name)
        devoteeName: { 
            type: String, 
            required: true // This is the devotee's Full Name
        },
        gothram: { type: String, required: false },
        rashi: { type: String, required: false },
        nakshatra: { type: String, required: false },

        // --- LOCATION FIELDS ---
        state: { 
            type: String, 
            default: 'Karnataka' 
        },
        district: { 
            type: String, 
            default: 'Belagavi' 
        },
        taluk: { 
            type: String, 
            default: 'Athani' 
        },
        pincode: { type: String },
        place: { type: String }, // Village or Town
        address: { type: String }, // Full street address

        // --- PAYMENT FIELDS ---
        paymentMode: {
            type: String,
            required: true,
            enum: ['upi', 'cash'], // Restricts input to these two options
            default: 'upi'
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        
        // UTR for UPI payments (public users)
        utrNumber: {
            type: String,
            required: false,
        },
        // Razorpay Integration Fields (Used if paymentMode is 'upi')
        razorpayOrderId: {
            type: String,
            required: false,
        },
        razorpayPaymentId: {
            type: String,
            required: false,
        },

        // Sequential receipt number (1, 2, 3, ...) for display on receipts
        receiptNo: { type: Number, required: false },

        // --- BOOKING LOGISTICS ---
        bookingDate: { type: Date, default: Date.now },
        bookingType: { 
            type: String, 
            required: true,
            default: 'individual' 
        }, 
        count: { type: Number, default: 1 },
        status: {
            type: String,
            default: 'Pending', // Pending, Confirmed, Completed
        },
        // Photo order completion flag (for photo-order sevas)
        photoOrderCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;