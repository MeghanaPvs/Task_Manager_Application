const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL,{
     useNewUrlParser: true,
     useUnifiedTopology:true,
    useCreateIndex: true
})


//Creating another Model

// const Tasks = mongoose.model('Task',{ //passing name for the model
//     description:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     completed:{
//         type:Boolean,
//         default:false
//     }
// })

// //Instance

// const taskdata = new Tasks({
//     description:'Learn Node.js ',
//     completed:true
// })







