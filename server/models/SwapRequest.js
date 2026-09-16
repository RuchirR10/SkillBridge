const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    offeredSkill: {
      type: String,
      required: true
    },
    requestedSkill: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
