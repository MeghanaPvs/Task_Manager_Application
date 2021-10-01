const bycrypt = require('bcryptjs')

const myFunction = async()=>{
    const password = 'Meghana12345!' //user will provide
    const hashedPassword = await bycrypt.hash(password,8)
    //hash()=> 2 params: user pswd and how many tyms hash algorithm need to execute and 8 is good to go!
    console.log(password)
    console.log(hashedPassword)

    const isMatch = await bycrypt.compare('Meghana12345!',hashedPassword)
    console.log(isMatch)
}
myFunction()

