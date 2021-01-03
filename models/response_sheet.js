const mongoose = require('mongoose')
const responseSheetSchema = new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, 'Please enter student id!']
    },
    testId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Test",
        required:[true, 'Please enter test id!']
    },
    // score:{
    //     type:Number,
    //     default:-1,
    //     // required:[true, 'Please enter score achieved!']
    // },
    // max_score: {
    //     type:Number,
    //     required:[true, 'Please fill the max_score!'],
    // },
    // max_time: {
    //     type:Number,
    //     required:[true, 'Please fill the max_time or duration!'],
    // },
    responses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Response"
    }],    
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('ResponseSheet',responseSheetSchema)