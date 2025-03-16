const mongoose = require('mongoose');

const lead = new mongoose.Schema({
  projectId: {
    type: String,
  },
  projectname: {
    type: String,
    required: true,
  },
  codinglanguage: {
    type: String,
    required: true,
  },
  databasename: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  registerdate: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
  },
  plname: [{
    type: String,
    required: true,
  }],
  stage: {
    type: String,
  },
  action: {
    type: String
  }
});

const leadAllocation = mongoose.model('LeadAllocation', lead);
module.exports = leadAllocation;
