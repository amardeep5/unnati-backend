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
        enum: ['STUDENT','ADMIN','TEACHER']
    },
    paidAmount:{
        type:Number,
        default:0
    },
    dueAmount:{
        type:Number,
        default:0
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseEnrolled"
    }],
    teacherAccessCourses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    // pendingEvaluations:[{
    //     user:{
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "User"
    //     },
        
    // }],
    
    createdAt: { type: Date, default: Date.now },
})
mongoose.model('User',userSchema)