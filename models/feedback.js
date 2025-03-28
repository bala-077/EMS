const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: [{
    name: { type: String, required: true },
    rating: { 
      type: String, 
      enum: ['Excellent', 'Good', 'Average', 'Needs Improvement', 'Poor'],
      required: true 
    }
  }],
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  overallReview: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Calculate average rating
feedbackSchema.virtual('averageRating').get(function() {
  const ratingMap = {
    'Excellent': 5,
    'Good': 4,
    'Average': 3,
    'Needs Improvement': 2,
    'Poor': 1
  };
  
  const sum = this.skills.reduce((total, skill) => total + ratingMap[skill.rating], 0);
  return sum / this.skills.length;
});

module.exports = mongoose.model('Feedback', feedbackSchema);