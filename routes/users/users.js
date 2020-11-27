const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');

require('./../../models/user');
require('./../../models/topic');
require('./../../models/test');
require('./../../models/response');
require('./../../models/response_sheet');
require('./../../models/receipt');
require('./../../models/question');
require('./../../models/lecture');
require('./../../models/course');
require('./../../models/cafe');
require('./../../models/assignment');



const User = mongoose.model('User');
const Topic = mongoose.model('Topic');
const Test = mongoose.model('Test');
const Response = mongoose.model('Response');
const ResponseSheet = mongoose.model('ResponseSheet');
const Receipt = mongoose.model('Receipt');
const Question = mongoose.model('Question');
const Lecture = mongoose.model('Lecture');
const Course = mongoose.model('Course');
const Cafe = mongoose.model('Cafe');
const Assignment = mongoose.model('Assignment');
const authenticate = require('./../../middleware/authenticate')
const restrictTo = require('./../../middleware/restrictTo')

router.get("/getUserInfo/:username",authenticate,async (req,res)=>{
    try {
       const UserInfo = await User.find({username: req.params.username}).select("_id username firstName lastName phoneNumber email role createdAt");
       res.status(200).json({message:"User Info",done:true,UserInfo});
    } catch (err) {
       console.log(err);
       res.status(422).json({error:"Something went wrong",done:false});
    }
})

router.get("/getUserCourses/:username",authenticate,async (req,res)=>{
    try{
       const UserCourse = await User.find({username: req.params.username}).select("_id coursesEnrolled");
       
       res.status(200).json({message:"User Info",done:true,UserCourse});
    } catch (err) {
       console.log(err);
       res.status(422).json({error:"Something went wrong",done:false});
    }
})



module.exports=router