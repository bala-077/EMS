const mongoose = require('mongoose');

const plSchema = new mongoose.Schema({
  projectId: {
    type: String,
    require: true
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
    default: new Date().toISOString(),
  },
  plname: {
    type: String,
    required: true,
  },
});

const AllocateProject = mongoose.model('ProjectAllocation', plSchema);
module.exports = AllocateProject;

