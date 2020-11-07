const mongoose = require('mongoose')
const validator = require('validator');
const userSchema = new mongoose.Schema({

    user:{   
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    course:{   
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    feesPaid:{
        type:Boolean,
        default:false
    },
    assignmentsDone:[{
        assignment:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment"
        },
        marksScored:{
            type:Number,
            required:[true, 'Please fill the maximum marks of test!'],
        },
        attemptsLeft:{
            type:Number,
            default:3,
            required:[true, 'Please fill the maximum marks of test!'],
        }
    }],
    testsDone:[{
        test:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test"
        },
        marksScored:{
            type:Number,
            required:[true, 'Please fill the maximum marks of test!'],
        },
        responseSheet:{
            type: mongoose.Schema.Types.ObjectId,
              ref: "ResponseSheet"   
        }
    }],
    lecturesDone:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture"
    }],
    topicsDone:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic"
    }],
    createdAt: { type: Date, default: Date.now },
})
mongoose.model('Courses_enrolled',userSchema)