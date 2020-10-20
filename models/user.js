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
    isRejected:{
        type:Boolean,
        default:false
    }
})
mongoose.model('User',userSchema)