// routes/feedback.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

// Submit feedback
router.post('/submit', async (req, res) => {
    try {
      const { userId, projectId, reviewedBy, ...rest } = req.body;
  
      // Check if feedback already exists for this user-project-reviewer combination
      const existingFeedback = await Feedback.findOne({
        userId,
        projectId,
        reviewedBy
      });
  
      if (existingFeedback) {
        return res.status(400).json({ 
          message: 'Feedback already submitted for this developer and project' 
        });
      }
  
      const feedback = new Feedback({
        userId,
        projectId,
        reviewedBy,
        ...rest,
        submittedAt: new Date()
      });
  
      await feedback.save();
      res.status(201).json(feedback);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Get all feedback for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.params.userId })
      .sort({ submittedAt: -1 })
      .populate('projectId', 'projectname');
      
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all feedback for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ projectId: req.params.projectId })
      .sort({ submittedAt: -1 })
      .populate('userId', 'name userType');
      
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get average ratings for a user
router.get('/user/:userId/summary', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.params.userId });
    
    if (feedbacks.length === 0) {
      return res.json({ message: 'No feedback found for this user' });
    }

    // Calculate average ratings per skill
    const skillSummary = {};
    feedbacks.forEach(feedback => {
      feedback.skills.forEach(skill => {
        if (!skillSummary[skill.skillName]) {
          skillSummary[skill.skillName] = {
            total: 0,
            count: 0,
            average: 0
          };
        }
        skillSummary[skill.skillName].total += skill.rating;
        skillSummary[skill.skillName].count++;
      });
    });

    // Calculate averages
    for (const skill in skillSummary) {
      skillSummary[skill].average = 
        skillSummary[skill].total / skillSummary[skill].count;
    }

    res.json({
      totalFeedbacks: feedbacks.length,
      skillSummary,
      lastFeedback: feedbacks[0].submittedAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if feedback exists for a user-project combination
router.get('/check', async (req, res) => {
  try {
    const { userId, projectId } = req.query;
    
    if (!userId || !projectId) {
      return res.status(400).json({ 
        message: 'User ID and Project ID are required' 
      });
    }

    const existingFeedback = await Feedback.findOne({
      userId,
      projectId,
      reviewedBy: req.headers.authorization?.split(' ')[1] // Get the reviewer from token
    });

    res.json({ exists: !!existingFeedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all feedback
router.get('/all', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      
      
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;