const mongoose = require('mongoose')
const validator = require('validator');
const receiptSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:[true, 'Please fill amount'],
    },
    mode:{
        type:String,
        required:[true, 'Please fill a valid mode'],
    },
    paymentId:{
        type:String,
        required:[true, 'Please fill a valid ID'],
    },
    courseEnrolled:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    createdAt: { type: Date, default: Date.now },

})
mongoose.model('Receipt',receiptSchema)