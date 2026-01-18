const mongoose = require('mongoose');

const heroSlideSchema = mongoose.Schema({
    image: { type: String, required: true },
    titleEn: { type: String },
    titleKn: { type: String },
    subtitleEn: { type: String },
    subtitleKn: { type: String },
    locationEn: { type: String },
    locationKn: { type: String },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
