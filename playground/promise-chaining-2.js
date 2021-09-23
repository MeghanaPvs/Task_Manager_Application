require('../src/db/mongoose')
const Task = require('../src/models/task')

//Delete particular task based on ID
//Count the documnets whose tasks are incomplete(i.e completed:false)

//PROMISE CHAINING EXAMPLE
// Task.findByIdAndDelete('61495d28c8d5ab37a85f2970').then((deletedtask)=>{
// console.log(deletedtask)
// return Task.countDocuments({completed:false})
// }).then((result)=>{ // result stores return Task.countDocuments({completed:false}) output
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount = async(id)=>{ //pass params we need to delete a task
    const deletetask =  await Task.findByIdAndDelete(id)
    const countIncompletedTasks = await Task.countDocuments({completed:false})
    return countIncompletedTasks
} 

deleteTaskAndCount('614acba980f5d849bc8f14ee').then((countIncompletedTasks)=>{ //handling promise
    console.log(countIncompletedTasks)

}).catch((e)=>{
    console.log(e)
})//handled promise

