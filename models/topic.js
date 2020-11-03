const mongoose = require('mongoose')
const topicSchema = new mongoose.Schema({

    subjectCode:{
        type:String,
        required:[true, 'Please enter valid subject code!']
    },
    subjectName:{
        type:String,
        required:[true, 'Please enter valid subject name!']
    },
    topicName: {
        type:String,
        required:[true, 'Please fill the topic name !'],
    },
    //lectures schema to be built
    tests:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test"
    }],
    assignments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment"
    }],
    
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('Topic',topicSchema)