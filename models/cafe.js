const mongoose = require('mongoose')
const cafeSchema = new mongoose.Schema({
    location:{
        type:String
    },
    address:{
        type:String,
    },    
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('Cafe',cafeSchema)