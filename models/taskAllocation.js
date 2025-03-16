const mongoose = require('mongoose');

// Schema definition for Task Allocation
const task = new mongoose.Schema({
  taskDate: {
    type: String,
    required: true,
  },
  plname: {
    type: String,
    required: true,
  },
  stage: {
    type: String,
  },
  type: {
    type: String,
  },
});

const taskAllocation = mongoose.model('taskAllocation', task);

module.exports = taskAllocation;
