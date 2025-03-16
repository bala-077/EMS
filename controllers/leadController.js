const express = require('express');
const leadAllocation = require('../models/leadAllocation'); // Import the correct model

const route = express.Router();

// Route to create or update a project with developers
route.post('/createlead', async (req, res) => {
    try {
        const { projectId, dateCreated, projectname, codinglanguage, databasename, duration, registerdate, description, plname, stage, action } = req.body;

        // Debugging: Check what data is being passed
        console.log("Request Body:", req.body);

        // Check if the project already exists in the database (using projectname)
        const existingProject = await leadAllocation.findOne({ projectname });

        let updatedProject;

        if (existingProject) {
            // If the project exists, update the developer list (plname)
            if (action === "add") {
                // Add unique developers (avoid duplicates)
                updatedProject = await leadAllocation.findOneAndUpdate(
                    { projectname },
                    {
                        $addToSet: { plname: { $each: plname } }, // Add unique developers
                        $set: {
                            dateCreated,
                            codinglanguage,
                            databasename,
                            duration,
                            registerdate,
                            description,
                            stage
                        }
                    },
                    { new: true } // Return the updated document
                );
            } else if (action === "remove") {
                // Remove developers from the plname array
                updatedProject = await leadAllocation.findOneAndUpdate(
                    { projectname },
                    {
                        $pull: { plname: { $in: plname } }, // Remove developers
                        $set: {
                            dateCreated,
                            codinglanguage,
                            databasename,
                            duration,
                            registerdate,
                            description,
                            stage
                        }
                    },
                    { new: true }
                );
            }
        } else {
            // If project doesn't exist, create a new one
            const newProject = new leadAllocation({
                dateCreated,
                projectname,
                codinglanguage,
                databasename,
                duration,
                registerdate,
                description,
                plname,
                stage
            });

            updatedProject = await newProject.save();
        }

        console.log("Updated Project:", updatedProject); // Debugging: Log updated project
        return res.status(200).json(updatedProject);

    } catch (error) {
        console.error('Error saving project:', error);
        res.status(500).json({ error: 'Failed to save project' });
    }
});

// Route to get all projects
route.get('/get-lead', async (req, res) => {
    try {
        const data = await leadAllocation.find();
        console.log("Fetched Data:", data); // Debugging: Log the fetched data
        res.status(200).json({ data });
    } catch (err) {
        console.error("Error in /get-lead:", err); // Detailed error logging
        res.status(400).json({ message: err.message });
    }
});

// Route to update project status
route.put('/update-stage', async (req, res) => {
    try {
        const { stage, projectname } = req.body; // Extract stage from request body

        // Find and update the project by projectname
        const updatedProject = await leadAllocation.findOneAndUpdate(
            { projectname }, // Query to find the project by projectname
            { $set: { stage } }, // Update the stage field
            { new: true } // Return the updated document
        );

        // If the project is not found, return a 404 error
        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Return the updated project
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project status:', error);
        res.status(500).json({ error: 'Failed to update project status' });
    }
});

route.get('/get-status', async (req, res) => {
    try{
        const data = await leadAllocation.find();
        res.status(201).json({data});
    }
    catch(err) {
        console.log({message: err.message});
    }
})

module.exports = route;
