const express = require('express');
const ProjectAllocate = require('../models/plallocate'); // Assuming this is the path to the model
const projectAllocateRouter = express.Router();

// GET all project allocations
projectAllocateRouter.get('/create', async (req, res) => {
  try {
    const data = await ProjectAllocate.find();
    // Use map to extract plname and projectname from each document
    const projectData = data.map(item => ({
      plname: item.plname,
      projectname: item.projectname,
    }));
    res.json(projectData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while fetching projects.' });
  }
});


// CREATE a new project allocation
// projectAllocateRouter.post('/', async (req, res) => {
//   const body = req.body;
  
//   // Basic validation
//   if (!body.projectname || !body.codinglanguage || !body.databasename || !body.duration || !body.registerdate || !body.description || !body.plname) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }

//   try {
//     const plallocate = await ProjectAllocate.create({
//       projectname: body.projectname,
//       codinglanguage: body.codinglanguage,
//       databasename: body.databasename,
//       duration: body.duration,
//       registerdate: body.registerdate,
//       description: body.description,
//       plname: body.plname,
//       dateCreated: new Date().toISOString(),
//     });

//     // Return the created project allocation
//     res.status(201).json(plallocate); // Use `plallocate` here instead of `newProject`
//   } catch (err) {
//     // Handle duplicate key error (if projectname already exists)
//     if (err.code === 11000) {
//       return res.status(400).json({ error: 'A project with this name already exists.' });
//     }

//     console.error(err);
//     res.status(500).json({ error: 'Error creating project allocation.' });
//   }
// });

// PUT to update project developer (plname)
projectAllocateRouter.put('/:id', async (req, res) => {
  const projectId = req.params.id;
  const { plname } = req.body;

  // Log incoming request
  console.log('Received project ID:', projectId);
  console.log('Received new plname:', plname);

  // Ensure `plname` is provided
  if (!plname) {
    console.error('plname is missing');
    return res.status(400).json({ error: 'Project developer (plname) is required.' });
  }

  try {
    const project = await ProjectAllocate.findById(projectId);

    if (!project) {
      console.error('Project not found');
      return res.status(404).json({ error: 'Project not found.' });
    }

    project.plname = plname; // Update only the project developer (plname)

    const updatedProject = await project.save();
    console.log('Updated Project:', updatedProject); // Log updated project
    res.json(updatedProject); // Return the updated project
  } catch (err) {
    console.error('Error updating project developer:', err);
    res.status(500).json({ error: 'Error updating project developer.' });
  }
});

module.exports = projectAllocateRouter;
