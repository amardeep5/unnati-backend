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
    fees:[{   
        cafe:{
            type: mongoose.Schema.Types.ObjectId,
             ref: "Cafe"
        },
        amount:{
            type:Number,
            default:100,
            required:[true, 'Please enter valid amount!']
        }
    }],
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('Course',courseSchema)