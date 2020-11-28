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
    serialNumber:{
        type:Number,
    },
    topicName: {
        type:String,
        required:[true, 'Please fill the topic name !'],
    }, 
    contentOrder:[{ 
        id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        content:{
            type:String,
            enum:['ASSIGNMENT','TEST','LECTURE'],
            required:[true, 'Please fill the content type !'],
        }
    }],
    
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('Topic',topicSchema)