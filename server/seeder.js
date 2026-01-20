const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Seva = require('./models/Seva');
const User = require('./models/User');
const Booking = require('./models/Booking');
const Settings = require('./models/Settings');
const HeroSlide = require('./models/HeroSlide');

dotenv.config();
connectDB();

const sevasData = [
    {
        titleEn: 'Rudra Abhisheka',
        titleKn: 'ರುದ್ರ ಅಭಿಷೇಕ',
        templeNameEn: 'Shree Kshetra Ramatheertha',
        templeNameKn: 'ಶ್ರೀ ಕ್ಷೇತ್ರ ರಾಮತೀರ್ಥ',
        locationEn: 'Karnataka',
        locationKn: 'ಕರ್ನಾಟಕ',
        descriptionEn: 'Rudra Abhisheka creates positive energy and removes negative vibes. It involves bathing the Shiva Linga with panchamrita and other sacred items while chanting the Rudram.',
        descriptionKn: 'ರುದ್ರ ಅಭಿಷೇಕವು ಸಕಾರಾತ್ಮಕ ಶಕ್ತಿಯನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ ಮತ್ತು ನಕಾರಾತ್ಮಕ ಕಂಪನಗಳನ್ನು ತೆಗೆದುಹಾಕುತ್ತದೆ. ಇದು ಪಂಚಾಮೃತ ಮತ್ತು ಇತರ ಪವಿತ್ರ ವಸ್ತುಗಳೊಂದಿಗೆ ಶಿವಲಿಂಗವನ್ನು ಅಭ್ಯಂಜನ ಮಾಡುವುದನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ.',
        price: 350,
        category: 'Abhisheka',
        image: '/images/hero-hampi.jpg'
    },
    {
        titleEn: 'Mahalakshmi Alankara',
        titleKn: 'ಮಹಾಲಕ್ಷ್ಮಿ ಅಲಂಕಾರ',
        templeNameEn: 'Shree Kshetra Ramatheertha',
        templeNameKn: 'ಶ್ರೀ ಕ್ಷೇತ್ರ ರಾಮತೀರ್ಥ',
        locationEn: 'Karnataka',
        locationKn: 'ಕರ್ನಾಟಕ',
        descriptionEn: 'Special Alankara seva for Goddess Mahalakshmi. Grants protection and courage.',
        descriptionKn: 'ಮಹಾಲಕ್ಷ್ಮಿ ದೇವಿಗೆ ವಿಶೇಷ ಅಲಂಕಾರ ಸೇವೆ. ರಕ್ಷಣೆ ಮತ್ತು ಧೈರ್ಯವನ್ನು ನೀಡುತ್ತದೆ.',
        price: 1500,
        category: 'Special Pooja',
        image: '/images/hero-mysore.jpg'
    },
    {
        titleEn: 'Sarva Seva',
        titleKn: 'ಸರ್ವ ಸೇವೆ',
        templeNameEn: 'Shree Kshetra Ramatheertha',
        templeNameKn: 'ಶ್ರೀ ಕ್ಷೇತ್ರ ರಾಮತೀರ್ಥ',
        locationEn: 'Karnataka',
        locationKn: 'ಕರ್ನಾಟಕ',
        descriptionEn: 'Perform all daily sevas for the deity. Grants health, wealth and wisdom.',
        descriptionKn: 'ದೇವರಿಗೆ ಎಲ್ಲಾ ದೈನಂದಿನ ಸೇವೆಗಳನ್ನು ಮಾಡಿ. ಆರೋಗ್ಯ, ಸಂಪತ್ತು ಮತ್ತು ಬುದ್ಧಿವಂತಿಕೆಯನ್ನು ನೀಡುತ್ತದೆ.',
        price: 2001,
        category: 'Full Day',
        image: '/images/hero-udupi.jpg'
    },
    {
        titleEn: 'Kalyanotsavam',
        titleKn: 'ಕಲ್ಯಾಣೋತ್ಸವ',
        templeNameEn: 'Shree Kshetra Ramatheertha',
        templeNameKn: 'ಶ್ರೀ ಕ್ಷೇತ್ರ ರಾಮತೀರ್ಥ',
        locationEn: 'Karnataka',
        locationKn: 'ಕರ್ನಾಟಕ',
        descriptionEn: 'The marriage ceremony of the divine couple. Removes obstacles in marriage and brings family harmony.',
        descriptionKn: 'ದಿವ್ಯ ದಂಪತಿಗಳ ಮದುವೆ ಸಮಾರಂಭ. ಮದುವೆಯಲ್ಲಿನ ಅಡೆತಡೆಗಳನ್ನು ನಿವಾರಿಸುತ್ತದೆ ಮತ್ತು ಕೌಟುಂಬಿಕ ಸಾಮರಸ್ಯವನ್ನು ತರುತ್ತದೆ.',
        price: 2500,
        category: 'Kalyanam',
        image: '/images/seva-kalyanam.jpg'
    },
    {
        titleEn: 'Maha Rudrabhishekam',
        titleKn: 'ಮಹಾ ರುದ್ರಾಭಿಷೇಕ',
        templeNameEn: 'Shree Kshetra Ramatheertha',
        templeNameKn: 'ಶ್ರೀ ಕ್ಷೇತ್ರ ರಾಮತೀರ್ಥ',
        locationEn: 'Karnataka',
        locationKn: 'ಕರ್ನಾಟಕ',
        descriptionEn: 'A powerful seva performed with devotion. Bestows longevity, health, and peace of mind.',
        descriptionKn: 'ಭಕ್ತಿಯಿಂದ ನಡೆಸಲಾಗುವ ಶಕ್ತಿಯುತ ಸೇವೆ. ಸುದೀರ್ಘ ಆಯಸ್ಸು, ಆರೋಗ್ಯ ಮತ್ತು ಮನಸ್ಸಿನ ಶಾಂತಿಯನ್ನು ನೀಡುತ್ತದೆ.',
        price: 2100,
        category: 'Abhisheka',
        image: '/images/seva-rudra.jpg'
    },
    {
        titleEn: 'Kumkumarchana',
        titleKn: 'ಕುಂಕುಮಾರ್ಚನೆ',
        templeNameEn: 'Shree Kshetra Ramatheertha',
        templeNameKn: 'ಶ್ರೀ ಕ್ಷೇತ್ರ ರಾಮತೀರ್ಥ',
        locationEn: 'Karnataka',
        locationKn: 'ಕರ್ನಾಟಕ',
        descriptionEn: 'Archana performed with Kumkuma (vermilion) to the Goddess. Grants good health and prosperity.',
        descriptionKn: 'ದೇವಿಗೆ ಕುಂಕುಮದಿಂದ ಮಾಡುವ ಅರ್ಚನೆ. ಉತ್ತಮ ಆರೋಗ್ಯ ಮತ್ತು ಸಮೃದ್ಧಿಯನ್ನು ನೀಡುತ್ತದೆ.',
        price: 500,
        category: 'Archana',
        image: '/images/hero-udupi.jpg'
    },
    {
        titleEn: 'Deeparadhana',
        titleKn: 'ದೀಪಾರಾಧನೆ',
        templeNameEn: 'Shree Kshetra Ramatheertha',
        templeNameKn: 'ಶ್ರೀ ಕ್ಷೇತ್ರ ರಾಮತೀರ್ಥ',
        locationEn: 'Karnataka',
        locationKn: 'ಕರ್ನಾಟಕ',
        descriptionEn: 'Participate in the divine morning/evening Aarti. A blissful experience.',
        descriptionKn: 'ದಿವ್ಯ ಬೆಳಿಗ್ಗೆ/ಸಂಜೆ ಆರತಿಯಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಿ. ಒಂದು ಪರಮಾನಂದದ ಅನುಭವ.',
        price: 200,
        category: 'Aarti',
        image: '/images/seva-aarti.jpg'
    }
];

const importData = async () => {
    try {
        // Clear DB
        await Seva.deleteMany();
        await User.deleteMany();
        await Booking.deleteMany();

        // 1. Users
        const salt = await bcrypt.genSalt(10);
        const hashedAdminPassword = await bcrypt.hash('admin123', salt);
        const hashedUserPassword = await bcrypt.hash('user123', salt);

        const users = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@temple.com',
                password: hashedAdminPassword,
                role: 'admin',
                phone: '9999999999'
            },
            {
                name: 'Ramesh Kumar',
                email: 'ramesh@example.com',
                password: hashedUserPassword, // pre-hashed in real app or handled by hook, here explicit for bulk insert check logic
                role: 'user',
                phone: '9876543210'
            },
            {
                name: 'Suresh Raina',
                email: 'suresh@example.com',
                password: hashedUserPassword,
                role: 'user',
                phone: '9876543211'
            }
        ]);

        const adminUser = users[0];
        const user1 = users[1];
        const user2 = users[2];

        console.log('Users Imported!');

        // 2. Sevas
        const createdSevas = await Seva.insertMany(sevasData);
        console.log('Sevas Imported!');

        // 3. Bookings
        const bookings = [
            {
                user: user1._id,
                seva: createdSevas[0]._id, // Rudra Abhisheka
                devoteeName: 'Ramesh Kumar',
                gothram: 'Kashyapa',
                rashi: 'Simha (Leo)',
                nakshatra: 'Magha',
                bookingType: 'individual',
                count: 1,
                totalAmount: 350,
                isPaid: true,
                status: 'Confirmed'
            },
            {
                user: user1._id,
                seva: createdSevas[3]._id, // Kalyanotsavam
                devoteeName: 'Ramesh & Savita',
                gothram: 'Kashyapa',
                rashi: 'Simha (Leo)',
                nakshatra: 'Magha',
                bookingType: 'family',
                count: 1,
                totalAmount: 10000, // 4 * 2500
                isPaid: true,
                status: 'Confirmed'
            },
            {
                user: user2._id,
                seva: createdSevas[5]._id, // Siddhivinayak
                devoteeName: 'Suresh Raina',
                gothram: 'Bharadwaja',
                rashi: 'Kumbha (Aquarius)',
                nakshatra: 'Shatabhisha',
                bookingType: 'individual',
                count: 2,
                totalAmount: 10002,
                isPaid: true,
                status: 'Pending'
            }
        ];

        await Booking.insertMany(bookings);
        await Booking.insertMany(bookings);
        console.log('Bookings Imported!');

        // 4. Settings
        await Settings.create({
            templeName: 'Shree Kshetra Ramatheertha',
            contactEmail: 'contact@temple.com',
            contactPhone: '+91 80 1234 5678',
            address: 'Karnataka, India'
        });
        console.log('Settings Imported!');

        // 5. Hero Slides
        await HeroSlide.insertMany([
            {
                image: '/images/hero-hampi.jpg',
                titleEn: 'Divine Shree Kshetra Ramatheertha',
                titleKn: 'ದಿವ್ಯ ಶ್ರೀ ಕ್ಷೇತ್ರ ರಾಮತೀರ್ಥ',
                subtitleEn: 'Experience eternal peace and prosperity at our sacred sanctum.',
                subtitleKn: 'ನಮ್ಮ ಪವಿತ್ರ ಸನ್ನಿಧಿಯಲ್ಲಿ ಶಾಶ್ವತ ಶಾಂತಿ ಮತ್ತು ಸಮೃದ್ಧಿಯನ್ನು ಅನುಭವಿಸಿ.',
                locationEn: 'Shree Kshetra Ramatheertha',
                locationKn: 'ಶ್ರೀ ಕ್ಷೇತ್ರ ರಾಮತೀರ್ಥ',
                order: 1
            },
            {
                image: '/images/hero-mysore.jpg',
                titleEn: 'Sacred Rituals & Poojas',
                titleKn: 'ಪವಿತ್ರ ವಿಧಿವಿಧಾನಗಳು ಮತ್ತು ಪೂಜೆಗಳು',
                subtitleEn: 'Participate in time-honored traditions from anywhere in the world.',
                subtitleKn: 'ಪ್ರಪಂಚದ ಎಲ್ಲಿಂದಲಾದರೂ ನಮ್ಮ ಪವಿತ್ರ ಸಂಪ್ರದಾಯಗಳಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಿ.',
                locationEn: 'Main Sanctum',
                locationKn: 'ಮುಖ್ಯ ಗರ್ಭಗುಡಿ',
                order: 2
            },
            {
                image: '/images/hero-udupi.jpg',
                titleEn: 'Community & Devotion',
                titleKn: 'ಸಮುದಾಯ ಮತ್ತು ಭಕ್ತಿ',
                subtitleEn: 'Join us in our daily prayers and special festive celebrations.',
                subtitleKn: 'ನಮ್ಮ ದೈನಂದಿನ ಪ್ರಾರ್ಥನೆಗಳು ಮತ್ತು ವಿಶೇಷ ಹಬ್ಬದ ಆಚರಣೆಗಳಲ್ಲಿ ನಮ್ಮೊಂದಿಗೆ ಸೇರಿ.',
                locationEn: 'Temple Courtyard',
                locationKn: 'ದೇವಸ್ಥಾನದ ಆವರಣ',
                order: 3
            }
        ]);
        console.log('Hero Slides Imported!');

        console.log('--- ALL DATA IMPORTED ---');
        console.log('Admin Login: admin@temple.com / admin123');
        console.log('User Login: ramesh@example.com / user123');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Seva.deleteMany();
        await User.deleteMany();
        await Booking.deleteMany();
        await HeroSlide.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
