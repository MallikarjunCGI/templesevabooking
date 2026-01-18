const express = require('express');
const router = express.Router();
const { getSevas, getSevaById, createSeva, updateSeva, deleteSeva } = require('../controllers/sevasController');

router.route('/').get(getSevas).post(createSeva);
router.route('/:id').get(getSevaById).put(updateSeva).delete(deleteSeva);

module.exports = router;
