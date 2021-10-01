const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// //connecting to database:
// //URL: mongodb+srv://<username>:<password>@cluster0.qtt5f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// //Username: dbNewUser
// //Password: dbNewUser@1234
mongoose.connect('mongodb+srv://dbNewUser:dbNewUser1234@cluster0.0vtre.mongodb.net/Task_manager_Database?retryWrites=true&w=majority',{
    // useNewUrlParser: true,
    // useCreateIndex: true
})

const userSchema= new mongoose.Schema({
    name: {
    type: String,
    required:true, //Validation
    trim:true //To remove extra spaces before and after in the string
    },
    email:{
        type:String,
        unique:true, //when once email is created then same email is not taken by other users
        required:true,
        trim:true,  //To remove extra spaces before and after in the string
        lowercase:true,
        validate(emailvalue){
            if(!validator.isEmail(emailvalue)){ //from validator library isEmail() method used. isEmail() => contains all predefined conditions
                throw new Error('Email is Invalid')
            }

        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,//length should be greater than 7
        trim:true, //Extra spaces not allowed
        validate(value){ //Password hould not contian "password" as password 
            if(value.toLowerCase().includes("password")) // includes() methods makes sure that particluar string is there or not
            {
            throw new Error('It should not contain "password" as password for user')
            }
        }

    },
    age: {
        type: Number,
        //Validation
        default:0,// If value not provided default would be considered
        validate(value){ //takes age value
            if(value<0){
                throw new Error('Age cannot be negative number') 
            }
          }
        },
        tokens:[{
            token:{
                type:String,
                required:true
            }
        }],
        avatar:{
            type:Buffer
        }
},{
    timestamps:true
    // keep tracks of user documents when they were created or updated 

})


userSchema.virtual('tasks', {
 ref: 'Task',
 localField: '_id',
 foreignField: 'owner'
})

//Creating instances => i.e. data
// const me = new User({
//     name: '   Nakshatra    ', //TRIM WILL BE DONE
//     email:'    NAKSHTRA@GMAIL.COM', //TRIM ALONG WITH LOWERCASE CASE CONVERSION
//     //AGE IS 0 BY DEFAULT IF NOT PROVIDED
//     password:"werdfgtd"
// })

//saving the data to database

    // me.save().then(() => {
    // console.log(me)
    // }).catch((error) => {
    // console.log('Error!', error)
    // })


//generateAuthToken() function
//methods accessible on instances
userSchema.methods.generateAuthToken = async function () {
    const user = this
    //generate JWT
    const token = jwt.sign({ _id : user._id.toString() },process.env.JWT_SECRET)
    
    //saving tokens to databse
    user.tokens = user.tokens.concat({token:token})
    await user.save()

    return token


}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
     delete userObject.password
     delete userObject.tokens
     delete userObject.avatar


    return userObject
}

userSchema.statics.findByCredentials = async (email,password)=>{
//statics are accessible on models
    const user = await User.findOne({email})  //find email
    if(!user){
        throw new Error('Unable to login')
    }
    //verify pswd
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        throw new Error('Unable to login')
    }

    return user //if pswd is match to email then return that 

}
//HASH THE PLAIN TEXT BEFORE SAVING
//creating a model i.e User model:
//mongoose.model() //2 params: 1. name and 2. options

userSchema.pre('save', async function(next){
    //run this code before a user saved
    const user = this
    if(user.isModified('password')){//when pswd is updated =>hash pswd
        user.password = await bcrypt.hash(user.password,8)//2 params: what needed to be hashed, no.of. rounds

    }
    next()
})

//Delete Users tasks when that particular user is removed
//Code will run whenever a user is removed

userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id }) //delete all teh tasks of that user ID

    next()

})

const User = mongoose.model('User', userSchema)
module.exports = User
