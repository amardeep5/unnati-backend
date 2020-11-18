const mongoose = require('mongoose')
const lectureSchema = new mongoose.Schema({
 
    youtubeId:{
        type:String,
        required:true
    },
    name:{ type: String},
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('Lecture',lectureSchema)