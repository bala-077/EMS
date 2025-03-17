const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true, // Ensure userId is required
    },
    plname: {
        type: String,
        required: true, // Ensure plname is required
    },
    type: {
        type: String,
        required: true, // Ensure type is required
    },
    taskDate: {
        type: String,
        required: true, // Ensure taskDate is required
    },
    desc: {
        type: String,
        required: true, // Ensure desc is required
    },
    status: {
        type: String,
        default: "Pending", // Default status if not provided
    },
});

const TaskAllocation = mongoose.model('TaskAllocation', taskSchema);

module.exports = TaskAllocation;
