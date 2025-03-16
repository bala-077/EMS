const express = require('express');
const router = express.Router();
const Project = require('../models/plallocate'); // Your Mongoose model

// GET all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find(); // Fetch all projects
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
