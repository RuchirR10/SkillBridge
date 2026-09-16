const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SwapRequest = require('../models/SwapRequest');

// Create a swap request
router.post('/', async (req, res) => {
  try {
    const { sender, receiver, offeredSkill, requestedSkill, message } = req.body;
    const swap = await SwapRequest.create({
      sender,
      receiver,
      offeredSkill,
      requestedSkill,
      message: message || '',
      status: 'pending'
    });
    res.status(201).json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get swap statistics grouped by status (MongoDB aggregation)
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    let matchQuery = {};

    if (userId) {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      matchQuery = {
        $or: [{ sender: userObjectId }, { receiver: userObjectId }]
      };
    }

    const stats = await SwapRequest.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get swap requests (all, or filtered by userId)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    let filter = {};

    if (userId) {
      filter = {
        $or: [{ sender: userId }, { receiver: userId }]
      };
    }

    const swaps = await SwapRequest.find(filter)
      .populate('sender', 'name email bio skillsOffered skillsWanted')
      .populate('receiver', 'name email bio skillsOffered skillsWanted')
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update swap request status (accepted, rejected, completed)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const swap = await SwapRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    if (!swap) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    res.json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
