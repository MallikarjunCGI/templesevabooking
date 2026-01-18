const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HeroSlide = require('./models/HeroSlide');

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple');
        console.log('MongoDB Connected');

        const slides = await HeroSlide.find({});
        console.log('Hero Slides in DB:', JSON.stringify(slides, null, 2));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyData();
