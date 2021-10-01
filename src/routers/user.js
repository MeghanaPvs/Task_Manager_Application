//SEPERATE ROUTE FILES BASIC SYNTAX:

// const router = new express.Router()
// router.get('/test',(req,res)=>{
//     res.send('This is from other router')
// })
//we need to register that router in index.js
//app.use(router)


const express= require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')

//Email
const {sendWelcomeEmail} = require('../emails/account')

const {sendCancelationEmail} = require('../emails/account')




const router = new express.Router()

// app.post() => takes path,callback params

//CREATE - Users 

//replacing code with Async and Await
router.post('/users',async(req,res)=>{
    // console.log(req.body) //postman JSON data displays
    const user = new User(req.body)
    try{

        await user.save()
        //Send Email
        sendWelcomeEmail(user.email,user.name)

        //if save fulfilled
        //Challenge: 
        //1.Once signed up -> generate token for saved user
        //2.send back token and user
        //3. Test from postman 
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)

    }
})

//

router.post('/users/login',async(req,res)=>{
    //find user by email and pswd
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password) //User is models or collections
        //generating authentication tokens
        const token = await  user.generateAuthToken() //user is an instance
        res.send({user,token}) //short hand operator

    }catch(e)
    {
        res.status(400).send()

    }

})


//LOGOUT FROM ONE SESSION
router.post('/users/logout',auth,async(req,res)=>{
//auth : code will run only if it is authenticated.

    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
        return token.token !==req.token
        })
        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send()
    }

})

//LOGOUT FROM ALL SESSIONS I.E FORM ALL DEVICES

router.post('/users/logoutAll',auth,async(req,res)=>{
//auth : code will run only if it is authenticated.

    try{
        req.user.tokens =[]
        await req.user.save()
    res.send()
    }catch(e){
        res.status(500).send()
    }
})

//READ - Users
router.get('/users/me',auth, async(req,res)=>{ //get one's own profile
//auth : code will run only if it is authenticated.

//    try{
//     const userdetails = await User.find({}) 
//     res.send(userdetails) //retrieving all users
//     }catch(e){
//         res.status(500).send()
//     }
    res.send(req.user)
})

// router.get('/users/:id', async(req,res)=>{ //retrieving based on ID
//     //access dynamic ID that user provides
//     const _id = req.params.id
//     try{
//         const getuser = await User.findById(_id)
//         if(!getuser)
//         {
//             return res.status(404).send()
//         }
//         res.send(getuser)
//     }catch(e){
//         res.status(500).send()
//     }
// })


//UPDATE -USER

//update only urs user ID
router.patch('/users/me',auth,async(req,res)=>{
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

        updates.forEach((update)=> req.user[update]=req.body[update]) //update: paramter which we'll update in postman like name,email or pswd.
        await req.user.save() //middleware will be running
        
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        //req.body=>taking dynamic input
        //new:true =>to return a new updated user
        //runValidators:true => to run all validators  for updating
        // if(!user){ 
        //     //if there is no User with that ID
        //     return res.status(404).send()
        // }
        res.send(req.user)

    }catch(e){
        res.status(400).send()
    }
})

//DELETE - User

router.delete('/users/me',auth,async(req,res)=>{
    //auth : code will run only if it is authenticated.
    //user should not provide others users ID to delete instead we need to delete our own profile
    try{
        // const deleteuser = await User.findByIdAndDelete(req.user._id)
        // if(!deleteuser)
        // {
        //     return res.status(404).send()
        // }
        
        await req.user.remove()
        //email cancellation
        sendCancelationEmail(req.user.email,req.user.name)
      
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

//FILE UPLOAD:
const upload= multer({
    // dest:'avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be image of type JPG, JEG,PNG'))
        }
        cb(undefined,true)//if upload is done correctly
    }

})

//Adding avatar 

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    // req.user.avatar = req.file.buffer //remove the destination to access req.file.buffer
    //storing the req.file.buffer in users avatar
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    //sharp(file name)
    //.png() -> to convert to PNG
    req.user.avatar= buffer
    await req.user.save()  
    res.send()

},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//Delete profile pic
router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()//sends 200 ststus: i.e. OK

})

//fetching avatar
//RUN: Browser: http://localhost:5000/users/61551b9244db5f0e7c5802c9/avatar
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user||!user.avatar)
        {
            throw new Error()
        }
        //when things went well
        res.set('Content-Type','image/png')
        //2 params: key and value
        //key: header:Content-Type
        //value: image and image type
        res.send(user.avatar)
    }catch(e)
    {
        res.status(404).send()
    }

})

module.exports= router