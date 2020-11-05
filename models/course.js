const mongoose = require('mongoose')
const courseSchema = new mongoose.Schema({

    subjectCode:{
        type:String,
        required:[true, 'Please enter valid subject code!']
    },
    subjectName:{
        type:String,
        required:[true, 'Please enter valid subject name!']
    },
    courseName: {
        type:String,
        required:[true, 'Please fill the course name !'],
    },
    topics:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic"
    }],
    enrolledUsers:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    }],
    fees:{ 
        type:Number,
        default:100,
        required:[true, 'Please enter valid fees!']
    },
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('Course',courseSchema)