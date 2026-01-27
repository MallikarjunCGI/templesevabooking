const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Seva = require('./models/Seva');

dotenv.config();
connectDB();

// Original sevas (same as initial seed before accidental change)
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

const upsertSevas = async () => {
    try {
        for (const s of sevasData) {
            await Seva.findOneAndUpdate(
                { titleEn: s.titleEn },
                { $set: s },
                { upsert: true, new: true }
            );
            console.log('Upserted:', s.titleEn);
        }
        console.log('All sevas upserted.');
        process.exit();
    } catch (error) {
        console.error('Restore error:', error);
        process.exit(1);
    }
};

upsertSevas();
