const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    correctAns:{
        type:String,
        required:[true, 'Please enter encoded answer string!']
    },
    type:{
        type:Number,
        required:[true, 'Please enter type of question!']
    },
    statement: {
        type:String,
        required:[true, 'Please fill the question statement!'],
    },
    options:{
        type:Array,
        default:[]
    }
})

mongoose.model('question',userSchema)