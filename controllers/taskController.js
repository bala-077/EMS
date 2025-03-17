const express = require('express');
const taskAllocation = require('../models/taskAllocation');

const route = express.Router();


route.post('/create-task', async (req, res) => {
    try{
        const { taskDate, plname, stage, type } = req.body;
        await taskAllocation.create({ taskDate, plname, stage, type });
        res.status(200).json({message: "task create sucessfully"})
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
});

route.get("/get-task", async(req, res) => {
    try{
        const data = await taskAllocation.find();
        res.status(201).json({data});
        console.log(data)
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
})

module.exports = route;