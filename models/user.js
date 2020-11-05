const mongoose = require('mongoose')
const validator = require('validator');
const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
        required:[true, 'Please enter First name!']
    },
    lastName:{
        type:String,
        required:false,
    },
    phoneNumber:{
        type:Number,
        required:[true, 'Please fill a valid phone number!'],
        minlength: 10,
        maxlength: 10,
    },
    username:{
        type:String,
        required:[true, 'Please fill username!']
    },
    email:{
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: ['STUDENT','ADMIN','ENTREPRENEUR']
    },
    isAdminApproved:{
        type:Boolean,
        default:false
    },
    isAdminRejected:{
        type:Boolean,
        default:false
    },
    isTeacherRejected:{
        type:Boolean,
        default:false
    },
    isTeacherApproved:{
        type:Boolean,
        default:false
    },
    cafe:{
        type: mongoose.Schema.Types.ObjectId,
         ref: "Cafe"
    },
    receipts:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: "Receipt"
    }],
    coursesEnrolled:[{ 
        course:{   
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        feesPaid:{
            type:Boolean,
            default:false
        }
    }],
    teacherAccessCourses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
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
    coursesDone:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
    }],
    createdAt: { type: Date, default: Date.now },
})
mongoose.model('User',userSchema)