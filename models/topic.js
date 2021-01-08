const mongoose = require('mongoose')
const topicSchema = new mongoose.Schema({

    // subjectCode:{
    //     type:String,
    //     required:[true, 'Please enter valid subject code!']
    // },
    courseName:{
        type:String,
        required:[true, 'Please enter valid subject name!']
    },
    // serialNumber:{
    //     type:Number,
    // },
    topicName: {
        type:String,
        required:[true, 'Please fill the topic name !'],
    }, 
    contentOrder:[{ 
        id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        contentName:{
            type:String
        },
        content:{
            type:String,
            enum:['ASSIGNMENT','TEST','LECTURE'],
            // name: String,
            required:[true, 'Please fill the content type !'],
        },
        // dueDays:{type:Number,default:7},
    }],
    
    createdAt: { type: Date, default: Date.now },

})

mongoose.model('Topic',topicSchema)