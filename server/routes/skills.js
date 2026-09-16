const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new skill
router.post('/', async (req, res) => {
  try {
    const { name, category } = req.body;
    const skill = await Skill.create({ name, category });
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
