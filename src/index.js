const express = require('express')
require('./db/mongoose')
// const jwt = require('jsonwebtoken')

// const { Router } = require('express');
const userRouter = require('./routers/user'); //Requiring userRoute
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT



// //FileUploads:

// const multer = require('multer')
// const upload = multer({
//     dest:'images', //destination folder to save the uploaded images (here folder name is "images")
    // limits:{
    //     fileSize:1000000
    // },
    // fileFilter(req,file,cb){
    // //cb->callback
    // //originalname: API available for file 

    // //ex: accepting only PDF docs
    // // if(!file.originalname.endsWith('.pdf')){
    //      // return cb(new Error('Please Upload PDF file..'))
    // // }
    
    // //Accepting .doc or .docx files 
//     if(!file.originalname.match(/\.(doc|docx)$/))
//     {
//         return cb(new Error('Please Upload word document..'))

//     }
//     cb(undefined,true)//if upload is done correctly
//     // cb(undefined,false)


//     }
// })

// app.post('/upload',upload.single('uploadImages'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})

// })


//Express Middleware:
//REGISERING NEW MIDDLEWARE
//without middelware: new request -> run route handler
//with middleware : new request -> do something -> run route handler


//MIDDLEWARE FOR GET REQUESTS


// app.use((req,res,next)=>{
//  //next -> registers middleware     
//  //console.log(req.method,req.path) // output: if we call Get in postman it displyes outut as: "GET /users"
//  //next()
//  if(req.method==='GET'){
//      res.send('GET requests are disabled')
//  }
//  else{
//      next()
//  }
// })


//MIDDLEWARE FOR MAINTAINCE I.E. WHEN SERVERS DOWN 

// app.use((req,res,next)=>{
//     res.status(503).send('Site is currently down. Check back soon!')

// })


//parse incoming JSON
app.use(express.json())

app.use(userRouter) //Registered UserRouter
app.use(taskRouter) //Registering taskRouter


app.listen(port,()=>{
    console.log('Server running at port: '+port)
})


//const bycrypt = require('bcryptjs')
// const myFunction = async()=>{
//     const password = 'Meghana12345!' //user will provide
//     const hashedPassword = await bycrypt.hash(password,8)
//     //hash()=> 2 params: user pswd and how many tyms hash algorithm need to execute and 8 is good to go!
//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bycrypt.compare('Meghana12345!',hashedPassword)
//     console.log(isMatch)
// }


// myFunction()




// const myFunction = async()=>{
//    const token =  jwt.sign({_id:'abc@123'},'thisismynewcourse',{expiresIn:'7 days'}) //3 params: 1. object =>{ for authentication: we need id of user }
//                                                 //  2. String =>  a random series of chars
//                                                //  3. object:options=>expires
//     console.log(token)
//     const data = jwt.verify(token,'thisismynewcourse') 
//     //2 params
//     //1.token to verify
//     //2. secret to use
//     console.log(data)

// }
// myFunction()


//toJSON example:

// const pet ={
//     name:'dog'

// }

// pet.toJSON = function(){
//     console.log(this)
//     return this
// }

// console.log(JSON.stringify(pet))



//USER - TASK RELATIONSHIP:
// const Task = require('./models/task')
// const User = require('./models/user')


// const main = async()=>{
//     // //const user = await User.findById('61544fc6028a77146dee1304') //Owner Id should be given
//     // //await user.populate('tasks').execPopulate()
//     // //console.log(user.tasks)
    
//     // const task = await Task.findById('61547d7436539c1d78a386bb') //ID should be given
//     // //id: 61547d7436539c1d78a386bb
//     // //owner id: 61544fc6028a77146dee1304
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

// }
// main()