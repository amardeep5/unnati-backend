const mongoose = require('mongoose')
const questionSchema = new mongoose.Schema({
    correctAns:[{
        type:String,
        // required:[true, 'Please enter encoded answer string!']
    }],
    type:{
        type:String,
        enum: ['SINGLECORRECT','MULTICORRECT','TYPED'],
        required:[true, 'Please enter type of question!']
    },
    name:{type:String},
    statement: {
        type:String,
        required:[true, 'Please fill the question statement!'],
    },
    options:{
        type:Array,
        default:[],
    },
    maxMarks:{
        type:Number,
        // required:[true, 'Please enter maximum marks of question!']
    }
})  

mongoose.model('Question',questionSchema)