const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb+srv://dbNewUser:dbNewUser1234@cluster0.0vtre.mongodb.net/Task_manager_Database?retryWrites=true&w=majority',{
    // useNewUrlParser: true,
    // useCreateIndex: true
})


const taskSchema = mongoose.Schema({ 
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{ //whenever a task s been created then owner must be created
        type:mongoose.Schema.Types. ObjectId,  //type is objectID
        required:true,
        ref:'User'  //reference : 'User'=> User is the model name of user from model.js ->user.js file

    },
}, {
 timestamps:true
        
})

//Instance

// const taskdata = new Tasks({
//     description:'Learn Node.js ',
//     completed:true
// })

const Task = mongoose.model('Task',taskSchema)

module.exports = Task;


