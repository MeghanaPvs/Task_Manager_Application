const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dbNewUser:dbNewUser1234@cluster0.0vtre.mongodb.net/Task_manager_Database?retryWrites=true&w=majority',{
    // useNewUrlParser: true,
    // useCreateIndex: true
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







