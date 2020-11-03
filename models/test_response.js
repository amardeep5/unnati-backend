const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    student_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true, 'Please enter student id!']
    },
    test_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true, 'Please enter test id!']
    },
    score:{
        type:Number,
        required:[true, 'Please enter score achieved!']
    },
    max_score: {
        type:Number,
        required:[true, 'Please fill the max_score!'],
    },
    max_time: {
        type:Number,
        required:[true, 'Please fill the max_time or duration!'],
    },
    responses:{
        type:Array,
        default:[]
    }
})

mongoose.model('test_response',userSchema)