const mongoose = require('mongoose')
const lectureSchema = new mongoose.Schema({
 
    youtubeId:{
        type:String,
        required:true
    },
    name:{ type: String},
    notes:{
        type: String,
        required: 'URL can\'t be empty',
        unique: true
    },
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('Lecture',lectureSchema)