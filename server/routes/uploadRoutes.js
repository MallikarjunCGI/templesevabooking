const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');

// Ensure upload directory exists (server/public/images)
const uploadDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_');
        const name = `${base}-${Date.now()}${ext}`;
        cb(null, name);
    }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// POST /api/uploads/hero - upload hero image (admin)
router.post('/hero', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const host = req.get('host');
    const protocol = req.protocol;
    const url = `${protocol}://${host}/images/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
});

module.exports = router;
