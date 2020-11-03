mongoose.model('test_reponse',userSchema)
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    subjectCode:{
        type:String,
        required:[true, 'Please enter valid subject code!']
    },
    subjectName:{
        type:String,
        required:[true, 'Please enter valid subject name!']
    },
    topic: {
        type:String,
        required:[true, 'Please fill the topic of test!'],
    },
    duration: {
        type:Number,
        required:[true, 'Please fill the duration of test!'],
    },
    questions:{
        type:Array,
        default:[]
    }
})
    
mongoose.model('assignment',userSchema)