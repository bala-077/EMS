// models/Feedback.js
const mongoose = require('mongoose');

const skillRatingSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }
});

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  reviewedBy: { type: String, required: true},
  projectName: { type: String, required: true },
  skills: [skillRatingSchema],
  overallReview: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);