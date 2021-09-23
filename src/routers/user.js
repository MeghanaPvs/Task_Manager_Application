//SEPERATE ROUTE FILES BASIC SYNTAX:

// const router = new express.Router()
// router.get('/test',(req,res)=>{
//     res.send('This is from other router')
// })
//we need to register that router in index.js
//app.use(router)


const express= require('express')
const User = require('../models/user')

const router = new express.Router()

// app.post() => takes path,callback params

//CREATE - Users 

//replacing code with Async and Await
router.post('/users',async(req,res)=>{
    // console.log(req.body) //postman JSON data displays
    const user = new User(req.body)
    try{
        await user.save()
        //if save fulfiled
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)

    }
})


//READ - Users
router.get('/users', async(req,res)=>{
   try{
    const userdetails = await User.find({}) 
    res.send(userdetails) //retrieving all users
    }catch(e){
        res.status(500).send()
    }
    
})

router.get('/users/:id', async(req,res)=>{ //retrieving based on ID
    //access dynamic ID that user provides
    const _id = req.params.id
    try{
        const getuser = await User.findById(_id)
        if(!getuser)
        {
            return res.status(404).send()
        }
        res.send(getuser)
    }catch(e){
        res.status(500).send()
    }
})


//UPDATE -USER
router.patch('/users/:id',async(req,res)=>{
    //When adding a property that actually doesnot exists like adding height, hike etc...
    const updates = Object.keys(req.body) //this will return array of strings i.e. what we need to return in back
    //so converting Object (i.e req.body) to array of strings
    const allowedUpdates =['name','email','password','age']
    const isvalidOperation = updates.every((update)=>{
        //every()=> called each and every tym when we update a property
        return allowedUpdates.includes(update)
    })
    if(!isvalidOperation){
        return res.status(400).send({error: 'Invalid Updates'})
    }
    
    try{
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        //req.body=>taking dynamic input
        //new:true =>to return a new updated user
        //runValidators:true => to run all validators  for updating
        if(!user){ 
            //if there is no User with that ID
            return res.status(404).send()
        }
        res.send(user)

    }catch(e){
        res.status(400).send()
    }
})

//DELETE - User

router.delete('/users/:id',async(req,res)=>{
    try{
        const deleteuser = await User.findByIdAndDelete(req.params.id)
        if(!deleteuser)
        {
            return res.status(404).send()
        }
    res.send(deleteuser)
    }catch(e){
        res.status(500).send()
    }
})

module.exports= router