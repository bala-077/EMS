const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    plname: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    taskDate: {
        type: Date,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
    },
    allocatedBy: {
        type: String, 
        required: true
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

const TaskAllocation = mongoose.model('TaskAllocation', taskSchema);

module.exports = TaskAllocation;