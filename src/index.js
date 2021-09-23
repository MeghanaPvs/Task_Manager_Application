const express = require('express')
require('./db/mongoose')

const { Router } = require('express');
const userRouter = require('./routers/user'); //Requiring userRoute
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT||5000

//parse incoming JSON
app.use(express.json())

app.use(userRouter) //Registered UserRouter
app.use(taskRouter) //Registering taskRouter

app.listen(port,()=>{
    console.log('Server running at port: '+port)
})