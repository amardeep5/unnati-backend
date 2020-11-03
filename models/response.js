const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    response: {
        type:String,
        required:[true, 'Please fill the user response!'],
    }
})

mongoose.model('reponse',userSchema)