const AllocateProject = require("../models/plallocate");
const express = require('express');
const route = express.Router();

route.post('/create', async (req, res) => {
    try {
        const { projectId,projectname, codinglanguage, databasename, duration, registerdate, description, dateCreated, plname } = req.body;
        console.log(req.body, "This is the response data for project manager")

        // Check if the project already exists
        const existingProject = await AllocateProject.findOne({ projectname });

        if (existingProject) {
            // Update only the project leader (plname) if project already exists
            existingProject.plname = plname;
            await existingProject.save();

            return res.status(200).json({ message: "Project leader updated successfully." });
        }

        // If project does not exist, create a new entry
        await AllocateProject.create({
            projectId, projectname, codinglanguage, databasename, duration, registerdate, description, dateCreated, plname
        });

        res.status(200).json({ message: "Project created successfully." });

    } catch (err) {
        // Handle duplicate key error (E11000)
        if (err.code === 11000) {
            return res.status(400).json({ message: "Duplicate project name found. Please use a unique project name." });
        }
        
        console.error(err);
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
});

route.get('/get-allocation', async (req, res) => {
    try {
        const data = await AllocateProject.find();

        res.status(200).json({ data: data });

    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error fetching allocations" });
    }
});

module.exports = route;
