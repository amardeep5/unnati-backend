const mongoose = require('mongoose')
const testSchema = new mongoose.Schema({
    subjectCode:{
        type:String,
        required:[true, 'Please enter valid subject code!']
    },
    subjectName:{
        type:String,
        required:[true, 'Please enter valid subject name!']
    },
    serialNumber:{
        type:Number,
        required:true
    },
    testName: {
        type:String,
        required:[true, 'Please fill the topic of test!'],
    },
    duration: {
        type:Number,
        required:[true, 'Please fill the duration of test!'],
    },
    maxMarks: {
        type:Number,
        required:[true, 'Please fill the maximum marks of test!'],
    },
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }],
    // attemptedBy:[{
    //     user:{
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "User"
    //     },
    //     responseSheet:{
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "ResponseSheet"   
    //     }
    // }],
    
    createdAt: { type: Date, default: Date.now },

})
    
mongoose.model('Test',testSchema)