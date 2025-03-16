const booksRouter = require('express').Router()
const Project = require('../models/book')
const mongoose = require('mongoose')

function sanitizeString(str) {
  return str.replace(/[-_]/g, ' ')
}

// GET all books
booksRouter.get('/', async (req, res) => {
  const projects = await Project.find({}).sort({title: 1})
  return res.json(projects)
})

// GET a specific book
booksRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  let project = ''

  if (mongoose.isValidObjectId(id)) {
    project = await Project.findById(id)
  } else {
    const projectname = sanitizeString(decodeURI(id))
    project = await Project.find({
      projectname: { $regex: new RegExp(projectname, 'i') },
    })
  }

  return project
    ? res.json(project)
    : res.status(404).send({ error: `Project not found` }).end()
})

//CREATE a book
booksRouter.post('/', async (req, res) => {
  const body = req.body
  const user = req.user

  if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: `You're not an Admin to add a book` })
      .end()
  }

  const project = new Project({
    projectname: body.projectname,
    codinglanguage: body.codinglanguage,
    databasename: body.databasename,
    duration: body.duration,
    registerdate:body.registerdate,
    description:body.description,
    dateCreated: new Date().toISOString(),
  })

  const newProject= await project.save()
  return newProject ? res.status(201).json(newProject) : res.status(400).end()
})

//DELETE a book
booksRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  const user = req.user

  if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: `You're not an Admin to remove a book` })
      .end()
  }

  await Project.findByIdAndRemove(id)
  return res.status(204).end()
})

//UPDATE book data
booksRouter.put('/:id', async (req, res) => {
  const body = req.body
  const id = req.params.id
  const user = req.user

  if (user.userType !== 'admin') {
    return res
      .status(401)
      .send({ error: `You're not an Admin to update a book` })
      .end()
  }

  const projectData = await Project.findById(id)
  if (!projectData) {
    return res.status(404).send({ error: 'invalid Project' })
  }

  const project = {
    projectname: body.projectname ? body.projectname : projectData.projectname,
    codinglanguage: body.codinglanguage ? body.codinglanguage : projectData.codinglanguage,
    databasename: body.databasename ? body.databasename : projectData.databasename,
    duration: body.duration ? body.duration : projectData.duration,
    registerdate: body.registerdate ? body.registerdate : projectData.registerdate,
    description: body.description ? body.description : projectData.description,
    
  }

  const newProject = await Project.findByIdAndUpdate(id, project, { new: true })
  return newProject? res.json(newProject) : res.status(404).end()
})

module.exports = booksRouter
