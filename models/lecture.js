const mongoose = require('mongoose')
const lectureSchema = new mongoose.Schema({
 
    driveId:{
        type:String,
        // required:true
    },
    name:{ type: String},
    noteId:{
        type: String,
        //required: 'URL can\'t be empty',
        // unique: true
    },
    // dueDays:{type:Number,default:7},
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('Lecture',lectureSchema)