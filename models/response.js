const mongoose = require('mongoose')
const responseSchema = new mongoose.Schema({
    questionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    testId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test"
    },
    response: {
        type:String,
        required:[true, 'Please fill the response!'],
    },    
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('Response',responseSchema)