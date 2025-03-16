const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
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
})

// status: available, borrowed


Project=mongoose.model("Project", projectSchema)
module.exports = Project
