const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//CREATE - Tasks

router.post('/tasks',auth,async(req,res)=>{
    // console.log(req.body) //postman JSON data displays   
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,//copies all properties from body to the current object
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
      res.status(400).send(e)
  
    }
})

//READ - FETCH Tasks:

//Get all tasks:
// Filetring Data : http://localhost:5000/tasks?completed=true
//Pagination: limit and skip: http://localhost:5000/tasks?limit=5&skip=10 
//limits 5 records per page and skip=10 here skips 1 page

//SORTING:Fetch data in any order client like 
// parameters like a. completed= true ; b. createdAt time ; c. updatedAt......
//http://localhost:5000/tasks?sortBy=createdAt:desc
//http://localhost:5000/tasks?sortBy=createdAt:asc

router.get('/tasks',auth,async(req,res)=>{
    const match = {}
    const sort = {}
    if(req.query.completed)
    {
        match.completed = req.query.completed ==='true'
    }

    if(req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':')
        // split(':')=> we can use any special character that we will provide in the url to specify ascending or descending
        //http://localhost:5000/tasks?sortBy=createdAt:desc
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        //GET: {{url}}/tasks?sortBy=createdAt:desc //displays descending order
        //GET: {{url}}/tasks?sortBy=createdAt:asc  //displays ascending order
    }

    try{
        //const taskdetails = await Task.find({owner:req.user._id})

        //const taskdetails = await Task.find({owner:req.user._id})
        //res.send(taskdetails) //Retrieve all tasks
 
        //OR
        await req.user.populate({
            path:'tasks',
            match,//so that it displays the tasks based on the parameters we provided here displays completed:true
            options:{
                //limit:2
                limit : parseInt(req.query.limit), //pass limit in URL: 
                //GET: {{url}}/tasks?limit=2 //Displays first 2 records
                //GET:{{url}}/tasks //Displays all tasks
                skip : parseInt(req.query.skip),
                //GET: {{url}}/tasks?limit=2&skip=0 //Displays first 2 records
                //GET: {{url}}/tasks?limit=2&skip=4 //Displays 5th, 6th records if existed
                //GET: {{url}}/tasks?limit=3&skip=0 //Displays 1st,2nd,3rd records
                //GET: {{url}}/tasks?limit=3&skip=3 //Displays records from 4th 
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)


    }catch(e){
        res.status(500).send()
    }
})

//Get a particular task based on ID:
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id;
    try{
       // const gettask = await Task.findById(_id)
       const gettask = await Task.findOne({_id,owner:req.user._id}) 
       //get only the details when we login
        if(!gettask){
            return res.status(404).send()
        }           
    res.send(gettask) //To dispaly that particular Id based task
    }catch(e){
        res.status(500).send()
    }
})


//UPDATE - Tasks

router.patch('/tasks/:id',auth,async(req,res)=>{
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
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id}) 
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){ 
            return res.status(404).send()
        }
        updates.forEach((update)=> task[update]=req.body[update]) //update: paramter which we'll update in postman like name,email or pswd.
        await task.save() //middleware will be running

        res.send(task)

    }catch(e){
        res.status(400).send()
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const taskTodelete = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})

        //const taskTodelete = await Task.findByIdAndDelete(req.params.id)
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











// const express = require('express')
// const Task = require('../models/task')
// const auth = require('../middleware/auth')
// const router = new express.Router()

// router.post('/tasks', auth, async (req, res) => {
//     const task = new Task({
//         ...req.body,
//         owner: req.user._id
//     })

//     try {
//         await task.save()
//         res.status(201).send(task)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// router.get('/tasks', async (req, res) => {
//     try {
//         const tasks = await Task.find({})
//         res.send(tasks)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// router.get('/tasks/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const task = await Task.findById(_id)

//         if (!task) {
//             return res.status(404).send()
//         }

//         res.send(task)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// router.patch('/tasks/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         const task = await Task.findById(req.params.id)

//         updates.forEach((update) => task[update] = req.body[update])
//         await task.save()

//         if (!task) {
//             return res.status(404).send()
//         }

//         res.send(task)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// router.delete('/tasks/:id', async (req, res) => {
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id)

//         if (!task) {
//             res.status(404).send()
//         }

//         res.send(task)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// module.exports = router