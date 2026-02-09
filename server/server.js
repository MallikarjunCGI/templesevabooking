require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const sevasRoutes = require('./routes/sevasRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const heroRoutes = require('./routes/heroRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Load env vars
dotenv.config();

// Print all environment variables
console.log(process.env);

// Connect to database
connectDB();

const app = express();

const path = require('path');

// Serve uploaded images from server/public/images
const imagesDir = path.join(__dirname, 'public', 'images');
app.use('/images', express.static(imagesDir));

// Middleware
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://localhost:5174'],
//     credentials: true
// }));

app.use(cors({
    origin: true, // This reflects the request origin, allowing any URL
    credentials: true
}));
app.use(express.json());

app.get('/api/translate', async (req, res) => {
    const { text, from = 'en', to = 'kn' } = req.query;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();

        // Google Translate structure: [[["translation", "original", ...]], ...]
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            res.json({ translation: data[0][0][0] });
        } else {
            res.status(500).json({ error: 'Invalid translation response' });
        }
    } catch (error) {
        console.error('Translation proxy error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// Routes
const devoteeRoutes = require('./routes/devoteeRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/sevas', sevasRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/uploads', uploadRoutes);

app.use('/api/devotees', devoteeRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/version', (req, res) => {
    res.json({
        service: 'temple-seva-api',
        version: process.env.APP_VERSION || 'dev',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
