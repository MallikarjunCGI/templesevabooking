const mongoose = require('mongoose');

const sevaSchema = mongoose.Schema(
    {
        titleEn: {
            type: String,
        },
        titleKn: {
            type: String,
        },
        templeNameEn: {
            type: String,
        },
        templeNameKn: {
            type: String,
        },
        locationEn: {
            type: String,
        },
        locationKn: {
            type: String,
        },
        descriptionEn: {
            type: String,
        },
        descriptionKn: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String, // e.g., Homa, Abhisheka, Special
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Seva = mongoose.model('Seva', sevaSchema);

module.exports = Seva;
