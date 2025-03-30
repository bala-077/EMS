const express = require('express');
const TaskAllocation = require('../models/taskAllocation');
const moment = require('moment');
const route = express.Router();

// Create a new task
route.post('/create-task', async (req, res) => {
    console.log(req.body)
    try {
        // Validate required fields
        const requiredFields = ['userId', 'plname', 'type', 'taskDate', 'desc'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    message: `${field} is required`,
                    receivedData: req.body
                });
            }
        }

        const { userId, plname, type, taskDate, desc, status, allocatedBy } = req.body;
        
        // Convert and validate date
        const formattedTaskDate = new Date(taskDate);
        if (isNaN(formattedTaskDate.getTime())) {
            return res.status(400).json({ message: "Invalid task date" });
        }

        const expiryDate = moment(formattedTaskDate).add(1, 'day').toDate();

        const newTask = new TaskAllocation({
            userId, 
            plname, 
            type, 
            taskDate: formattedTaskDate, 
            desc, 
            status: status || "Pending",
            expiryDate,
            allocatedBy: allocatedBy || 'system'
        });

        await newTask.save();
        
        res.status(201).json({ 
            message: "Task created successfully",
            task: newTask
        });
    } catch (err) {
        console.error("Error creating task:", {
            error: err.message,
            stack: err.stack,
            receivedData: req.body
        });
        res.status(400).json({ 
            message: "Failed to create task",
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Get all tasks
route.get("/get-task", async (req, res) => {
    try {
        const tasks = await TaskAllocation.find({})
            .sort({ taskDate: 1 });

        res.status(200).json({ 
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        res.status(400).json({ 
            message: "Failed to fetch tasks",
            error: err.message 
        });
    }
});

// Get tasks for specific user (Developer view)
// route.get("/get-user-tasks/", async (req, res) => {
//     try {
//         const { plname } = req.body;
//         const today = moment().startOf('day');
        
//         const data = await TaskAllocation.find({
//             plnname,
//             taskDate: {
//                 $gte: today.toDate(),
//                 $lte: moment(today).endOf('day').toDate()
//             },
//             status: { $ne: "Completed" } // Only show incomplete tasks
//         });
        
//         res.status(200).json({ data });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// Get developer dashboard data - Updated to use query params
route.get("/developer-dashboard", async (req, res) => {
    try {
        const { plname } = req.query; // Changed from req.body to req.query
        if (!plname) {
            return res.status(400).json({ message: "plname is required" });
        }

        const todayStart = moment().startOf('day');
        const todayEnd = moment().endOf('day');
        
        const tasks = await TaskAllocation.find({
            plname,
            taskDate: {
                $gte: todayStart.toDate(),
                $lte: todayEnd.toDate()
            }
        }).sort({ createdAt: -1 });
        
        // Calculate stats
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === "Completed").length;
        const pendingTasks = totalTasks - completedTasks;
        
        res.status(200).json({ 
            stats: {
                totalTasks,
                completedTasks,
                pendingTasks
            },
            tasks
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update task status (Developer only)
route.patch("/update-task/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        
        const task = await TaskAllocation.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        // Validate task date is today
        const today = moment().startOf('day');
        const taskDay = moment(task.taskDate).startOf('day');
        
        if (!today.isSame(taskDay)) {
            return res.status(400).json({ 
                message: "Can only update tasks for today's date" 
            });
        }
        
        // Update task
        task.status = status;
        if (status === "Completed") {
            task.completedAt = new Date();
        }
        
        await task.save();
        res.status(200).json({ 
            message: "Task updated successfully",
            task
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete completed tasks (Automated cleanup)
route.delete("/cleanup-tasks", async (req, res) => {
    try {
        // Delete tasks completed more than 1 day ago
        const cutoffDate = moment().subtract(1, 'day').toDate();
        
        const result = await TaskAllocation.deleteMany({
            status: "Completed",
            completedAt: { $lte: cutoffDate }
        });
        
        res.status(200).json({
            message: `Deleted ${result.deletedCount} completed tasks`,
            deletedCount: result.deletedCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = route;