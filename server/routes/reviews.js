const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Create a review
router.post('/', async (req, res) => {
  try {
    const { reviewer, reviewee, rating, comment } = req.body;
    const review = await Review.create({
      reviewer,
      reviewee,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reviews for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
