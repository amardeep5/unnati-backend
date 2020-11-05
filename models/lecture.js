const mongoose = require('mongoose')
const lectureSchema = new mongoose.Schema({

    // to be completed 
    
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('Lecture',lectureSchema)