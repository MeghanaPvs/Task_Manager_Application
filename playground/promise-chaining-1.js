const { findByIdAndUpdate } = require('../src/models/user')

require('../src/db/mongoose')
const User = require('../src/models/user')

// id : 6148d2b8e075b000a9e3851f


//Promise chaining
//updating user age from 0 to 1
//First find that particular user with Id and then update that id's age
// User.findByIdAndUpdate('6148d38ed11c96d7898668b3',{age:1}).then((user) =>{
//     console.log(user)
//     return User.countDocuments({age:1}) //count the documents whose age=1
// }) .then((result)=>{ //returning user whose age is 1 
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

// Replacing above code(i.e. Promise Chaining) to : ASYNC AND AWAIT Functionality

const updateAgeAndCount =async(id,updateage)=>{
    const user = await User.findByIdAndUpdate(id,{age:updateage})
    const count = await User.countDocuments({age:updateage})
    return count
}

updateAgeAndCount('6148d38ed11c96d7898668b3',19).then((count)=>{
    console.log(count)

}).catch((e)=>{
    console.log(e)
})
