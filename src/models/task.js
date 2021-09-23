const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb+srv://dbNewUser:dbNewUser1234@cluster0.0vtre.mongodb.net/Task_manager_Database?retryWrites=true&w=majority',{
    // useNewUrlParser: true,
    // useCreateIndex: true
})

const Task = mongoose.model('Task',{ //passing name for the model
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    }
})

//Instance

// const taskdata = new Tasks({
//     description:'Learn Node.js ',
//     completed:true
// })

module.exports = Task;