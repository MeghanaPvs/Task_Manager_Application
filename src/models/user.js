const mongoose = require('mongoose')
const validator = require('validator')

// //connecting to database:
// //URL: mongodb+srv://<username>:<password>@cluster0.qtt5f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// //Username: dbNewUser
// //Password: dbNewUser@1234
mongoose.connect('mongodb+srv://dbNewUser:dbNewUser1234@cluster0.0vtre.mongodb.net/Task_manager_Database?retryWrites=true&w=majority',{
    // useNewUrlParser: true,
    // useCreateIndex: true
})

//creating a model i.e User model:
//mongoose.model() //2 params: 1. name and 2. options
const User = mongoose.model('User', {
    name: {
    type: String,
    required:true, //Validation
    trim:true //To remove extra spaces before and after in the string
    },
    email:{
        type:String,
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


module.exports = User