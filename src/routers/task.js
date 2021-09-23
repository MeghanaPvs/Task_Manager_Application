const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

//CREATE - Tasks

router.post('/tasks',async(req,res)=>{
    // console.log(req.body) //postman JSON data displays
    // res.send('testing')
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
      res.status(400).send(e)
  
    }
})

//READ - FETCH Tasks:

//Get all tasks:

router.get('/tasks',async(req,res)=>{
    try{
        const taskdetails = await Task.find({})
        res.send(taskdetails) //Retrieve all tasks

    }catch(e){
        res.status(500).send()
    }
})

//Get a particular task based on ID:
router.get('/tasks/:id',async(req,res)=>{
    const _id = req.params.id;
    try{
        const gettask = await Task.findById(_id)
        if(!gettask){
            return res.status(404).send()
        }
    res.send(gettask) //To dispaly that particular Id based task
    }catch(e){
        res.status(500).send()
    }
})


//UPDATE - Tasks

router.patch('/tasks/:id',async(req,res)=>{
    //When adding a property that actually doesnot exists like adding hike etc...
    const updates = Object.keys(req.body) //this will return array of strings i.e. what we need to return in back
    //so converting Object (i.e req.body) to array of strings
    const allowedUpdates =['description','completed']
    const isvalidOperation = updates.every((update)=>{
        //every()=> called each and every tym when we update a property
        return allowedUpdates.includes(update)
    })
    if(!isvalidOperation){
        return res.status(400).send({error: 'Invalid Updates'})
    }
    
    try{
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){ 
            return res.status(404).send()
        }
        res.send(task)

    }catch(e){
        res.status(400).send()
    }
})

router.delete('/tasks/:id',async(req,res)=>{
    try{
        const taskTodelete = await Task.findByIdAndDelete(req.params.id)
        if(!taskTodelete)
        {
            res.status(404).send()
        }
    res.send(taskTodelete)
    }catch(e){
        res.status(500).send()
   }
})


module.exports = router