const asyncHandler = require('express-async-handler');
const HeroSlide = require('../models/HeroSlide');

// @desc    Get all hero slides
// @route   GET /api/hero
// @access  Public
const getHeroSlides = asyncHandler(async (req, res) => {
    const slides = await HeroSlide.find({}).sort('order');
    res.json(slides);
});

// @desc    Create a hero slide
// @route   POST /api/hero
// @access  Private/Admin
const createHeroSlide = asyncHandler(async (req, res) => {
    try {
        const { image, titleEn, titleKn, subtitleEn, subtitleKn, locationEn, locationKn, order } = req.body;

        const slide = new HeroSlide({
            image,
            titleEn,
            titleKn,
            subtitleEn,
            subtitleKn,
            locationEn,
            locationKn,
            order: order || 0
        });

        const createdSlide = await slide.save();
        res.status(201).json(createdSlide);
    } catch (error) {
        console.error('Error creating hero slide:', error);
        res.status(400);
        throw error;
    }
});

// @desc    Update a hero slide
// @route   PUT /api/hero/:id
// @access  Private/Admin
const updateHeroSlide = asyncHandler(async (req, res) => {
    try {
        const { image, titleEn, titleKn, subtitleEn, subtitleKn, locationEn, locationKn, order } = req.body;

        const slide = await HeroSlide.findById(req.params.id);

        if (slide) {
            slide.image = image || slide.image;
            slide.titleEn = titleEn || slide.titleEn;
            slide.titleKn = titleKn || slide.titleKn;
            slide.subtitleEn = subtitleEn || slide.subtitleEn;
            slide.subtitleKn = subtitleKn || slide.subtitleKn;
            slide.locationEn = locationEn || slide.locationEn;
            slide.locationKn = locationKn || slide.locationKn;
            slide.order = order !== undefined ? order : slide.order;

            const updatedSlide = await slide.save();
            res.json(updatedSlide);
        } else {
            res.status(404);
            throw new Error('Hero slide not found');
        }
    } catch (error) {
        console.error('Error updating hero slide:', error);
        res.status(400);
        throw error;
    }
});

// @desc    Delete a hero slide
// @route   DELETE /api/hero/:id
// @access  Private/Admin
const deleteHeroSlide = asyncHandler(async (req, res) => {
    const slide = await HeroSlide.findById(req.params.id);

    if (slide) {
        await slide.deleteOne();
        res.json({ message: 'Hero slide removed' });
    } else {
        res.status(404);
        throw new Error('Hero slide not found');
    }
});

module.exports = {
    getHeroSlides,
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide
};
