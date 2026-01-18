const asyncHandler = require('express-async-handler');
const Seva = require('../models/Seva');

// @desc    Fetch all sevas
// @route   GET /api/sevas
// @access  Public
const getSevas = asyncHandler(async (req, res) => {
    const sevas = await Seva.find({ isActive: true });
    res.json(sevas);
});

// @desc    Fetch single seva
// @route   GET /api/sevas/:id
// @access  Public
const getSevaById = asyncHandler(async (req, res) => {
    const seva = await Seva.findById(req.params.id);

    if (seva) {
        res.json(seva);
    } else {
        res.status(404);
        throw new Error('Seva not found');
    }
});

// @desc    Create a seva
// @route   POST /api/sevas
// @access  Private/Admin
const createSeva = asyncHandler(async (req, res) => {
    try {
        const { titleEn, titleKn, templeNameEn, templeNameKn, locationEn, locationKn, descriptionEn, descriptionKn, price, image, category } = req.body;

        const seva = new Seva({
            titleEn,
            titleKn,
            templeNameEn,
            templeNameKn,
            locationEn,
            locationKn,
            descriptionEn,
            descriptionKn,
            price,
            image,
            category
        });

        const createdSeva = await seva.save();
        res.status(201).json(createdSeva);
    } catch (error) {
        console.error('Error creating seva:', error);
        res.status(400);
        throw error;
    }
});

// @desc    Update a seva
// @route   PUT /api/sevas/:id
// @access  Private/Admin
const updateSeva = asyncHandler(async (req, res) => {
    try {
        const { titleEn, titleKn, templeNameEn, templeNameKn, locationEn, locationKn, descriptionEn, descriptionKn, price, image, category } = req.body;

        const seva = await Seva.findById(req.params.id);

        if (seva) {
            seva.titleEn = titleEn || seva.titleEn;
            seva.titleKn = titleKn || seva.titleKn;
            seva.templeNameEn = templeNameEn || seva.templeNameEn;
            seva.templeNameKn = templeNameKn || seva.templeNameKn;
            seva.locationEn = locationEn || seva.locationEn;
            seva.locationKn = locationKn || seva.locationKn;
            seva.descriptionEn = descriptionEn || seva.descriptionEn;
            seva.descriptionKn = descriptionKn || seva.descriptionKn;
            seva.price = price || seva.price;
            seva.image = image || seva.image;
            seva.category = category || seva.category;

            const updatedSeva = await seva.save();
            res.json(updatedSeva);
        } else {
            res.status(404);
            throw new Error('Seva not found');
        }
    } catch (error) {
        console.error('Error updating seva:', error);
        res.status(400);
        throw error;
    }
});

// @desc    Delete a seva
// @route   DELETE /api/sevas/:id
// @access  Private/Admin
const deleteSeva = asyncHandler(async (req, res) => {
    const seva = await Seva.findById(req.params.id);

    if (seva) {
        await Seva.deleteOne({ _id: req.params.id });
        res.json({ message: 'Seva removed' });
    } else {
        res.status(404);
        throw new Error('Seva not found');
    }
});

module.exports = { getSevas, getSevaById, createSeva, updateSeva, deleteSeva };
