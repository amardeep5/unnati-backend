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
require('./../../models/course_enrolled');


const User = mongoose.model('User');
const Topic = mongoose.model('Topic');
const Test = mongoose.model('Test');
const Response = mongoose.model('Response');
const ResponseSheet = mongoose.model('ResponseSheet');
const Receipt = mongoose.model('Receipt');
const Question = mongoose.model('Question');
const Lecture = mongoose.model('Lecture');
const Course = mongoose.model('Course');
const CourseEnrolled = mongoose.model('CourseEnrolled');
const Cafe = mongoose.model('Cafe');
const Assignment = mongoose.model('Assignment');
const authenticate = require('./../../middleware/authenticate')
const restrictTo = require('./../../middleware/restrictTo')

// all courses list
router.get("/all-courses",async (req,res) => {
    try {
        const courses = await Course.find({})
        res.status(200).json({done: true,courses})
    } catch (error) {
        console.log(error);
    }
})
// info of course in a cafe (loggin)
router.get("/cafe/:cafeId/coursedetail/:courseId",async (req,res) => {
    try {
        var course = await Course.findOne({_id: req.params.courseId}).populate({
            path: 'topics',
            select:'topicName',
        }).select("courseName summary topics fees")
        var cafeFee=0
        course.fees.forEach(async (fee)=>{
            if(fee.cafe.toString() === req.params.cafeId.toString()){
                cafeFee = fee.amount;
                // console.log(fee.amount)
            }
        })
        course.topics=undefined
        course.fees=undefined
        res.status(200).json({done: true,course,cafeFee})
    } catch (error) {
        console.log(error);
    }
})

// user specific apis

// router.get("/enrolled-courses/:userId",async (req,res) => {
//     try {
//         userCourses = await User.find({_id: req.params.userId}).populate({
//             path:'courseEnrolled',
//             populate : {
//                 path: 'course' , 
//                 populate :{ path:'topics', select:'_id topicName contentOrder'},
//                 select: '_id courseName topics'
//             }
//         }).select("courseEnrolled")
//         if(userCourses){
//             userCourses.forEach((course)=>{
//                 var tests = []
//                 var assignments = []
//                 course.course.topics.forEach((topic)=>{
//                     topic.contentOrder.forEach((content)=>{
//                         if(content.content==='TEST'){
//                             test = await Test.find({_id:content.id})
//                             tests.push(test)
//                         }else if(content.content==='ASSIGNMENT'){
//                             assignment = await Assignment.find({_id:content.id})
//                             assignments.push(assignment)
//                         }
//                     })
//                 })
//                 course.tests=tests;
//                 courses.assignments=assignments;
//             })
//             res.status(200).json({done: true,userCourses,message:'All User Courses with topics , assignments and tests'})
//         }else{
//             res.status(422).json({done: false,message: 'User not found'})
//         }
        
//     } catch (error) {
//         console.log(error);
//     }
// })
// cafe info with no. of students in cafe 
router.get('/cafeinformation/:cafeId',async (req,res)=>{
    try {
        const cafe  = await Cafe.findOne({ _id: req.params.cafeId})
        if(cafe){
            const users = await User.find({cafe: req.params.cafeId}).select('username role firstName lastName')
            if(users){
                res.json({done: true,cafe,userNumbers : users.length-1,users})
            }else{
                res.json({done: false,message: ' no users found'})    
            }
        }else{
            res.json({done: false,message: 'cafe not found'})
        }
        
    } catch (error) {
        console.log(error)
    }
})
// all user past receipts 
router.get("/user-receipts/:userId",async (req,res)=>{
    try {
        const userReceipts = await User.findOne({_id: req.params.userId}).populate('receipts').select('receipts')
        res.status(200).json({done: true,userReceipts:userReceipts.receipts,message:'All User Receipts'})
    } catch (error) {
        console.log(error);
    }

})

// list of all enrolled courses
router.get("/enrolled-courses/:userId",async (req,res) => {
    try {
        var userCourses = await User.findOne({_id: req.params.userId}).populate({
            path:'coursesEnrolled',
            populate : {
                path: 'course' , 
                populate: { path: 'topics', select:'contentOrder'},
                select: '_id courseName topics',
            }
        }).select("courseEnrolled")
        // console.log(userCourses);
         if(userCourses){
            var percentStatus = [];

            for (const userCourse of userCourses.coursesEnrolled){
                var totalLength = 0,calcLength=0;
                for(const topic of userCourse.course.topics){
                    totalLength = totalLength + topic.contentOrder.length;
                }
                    calcLength = calcLength + userCourse.assignmentsDone.length + userCourse.testsDone.length + userCourse.lecturesDone.length
                var percentDone = (calcLength / totalLength)*100 
                percentStatus.push(percentDone);
           }
           userCourses = userCourses.coursesEnrolled
           for (var course of userCourses) {
               course.lecturesDone=undefined
               course.assignmentsDone=undefined
               course.testsDone=undefined
               course.user=undefined
               course.course.topics=undefined
           }
            res.status(200).json({done: true,userCourses,percentStatus,message:'All User Courses with ids'})
        }else{
            res.status(422).json({done: false,message: 'User not found'})
        }
        
    } catch (error) {
        console.log(error);
    }
})
// list of unenrolled courses
// var removeByAttr = function(arr, attr, value){
//     var i = arr.length;
      
//     while(i--){
//         if( arr[i] 
//         //    && arr[i].hasOwnProperty(attr) 
//            && (arguments.length > 2 && arr[i][attr] === value.toString() ) ){ 
//             // console.log("yoyoy",arr[i][attr]);
//            arr.splice(i,1);

//        }
//     }
//     console.log("func",arr);
//     return arr;
// }
// router.get("/unenrolled-courses/:userId",async (req,res) => {
//     try {
//         var userCourses = await User.findOne({_id: req.params.userId}).populate({
//             path:'coursesEnrolled',
//             populate : {
//                 path: 'course' , 
//                 select: '_id courseName',
//             },
//             select:'course'
//         }).select("courseEnrolled")
//         userCourses = userCourses.coursesEnrolled
//          if(userCourses){
//             var courses = await Course.find({}).select('courseName _id'); 
//             for (const course of courses){
//                 for (const obj of userCourses) {
//                     if(obj.course._id.toString()===course._id.toString()){
//                         courses = removeByAttr(courses, 'courseName', course.courseName);
//                     }
//                 }
//            }
//             res.status(200).json({done: true,courses,message:'All User Unenrolled Courses with ids'})
//         }else{
//             res.status(422).json({done: false,message: 'User not found'})
//         }
        
//     } catch (error) {
//         console.log(error);
//     }
// })
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
// opens the details of a course like lecture , tests and assignment
router.get("/enrolled-course/:userId/course/:courseId",async (req,res) => {
    try {
        let response = {done: true}
        response['course'] = await Course.findOne({_id: req.params.courseId}).populate({
            path: 'topics',
            select:'_id topicName contentOrder',
        }).select("courseName topics")
        // for (let i=0; i<response.course.topics.length; i++) {
        //     for (let j=0; j<response.course.topics[i].contentOrder.length; j++) {
        //         // console.log("yes",course['topics'][i]);
        //     }
        // }
        var courseResponse = await CourseEnrolled.findOne({user:req.params.userId,course:req.params.courseId});
        response.courseResponse=courseResponse
        // response.course['done'] = false;
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
    }
})

// // router.get("/enrolled-course/:userId/course/:courseId/topic/:topicId",async (req,res) => {
// //     try {
// //         var topic = await Topic.findOne({_id: req.params.topicId})
//         console.log(topic)
//         for (var content of topic['contentOrder']){
//             if(content.content==='TEST'){
//                 test = await Test.findOne({_id:content.id}).select("_id testName")
//                 content.name = test.testName
//             }else if(content.content==='ASSIGNMENT'){
//                 assignment = await Assignment.find({_id:content.id}).select("_id assignmentName")
//                 content.name = assignment.assignmentName
//             }else{
//                 lecture = await Lecture.findOne({_id:content.id}).select("_id lectureName")
//                 contentOrder.name = lecture.lectureName
//             }
//         }
// //         res.status(200).json({done: true,topic})
// //     } catch (error) {
// //         console.log(error);
// //     }
// // })

router.get("/enrolled-course/:userId/course/:courseId/lecture/:lectureId",async (req,res)=>{
    try {
        const lecture = await Lecture.findOne({_id:req.params.lectureId})
        if(lecture){
            res.status(200).json({done: true,lecture})
        }else{
            res.status(422).json({done: false,message: 'Lecture not found'})
        }
    } catch (error) {
        console.log(error);
    }
})
router.get("/enrolled-course/:userId/course/:courseId/test/:testId",async (req,res)=>{
    try {

        const enrolledCourse = await CourseEnrolled.findOne({user : req.params.userId, course:req.params.courseId})
        var done = false,marksScored=-1

        enrolledCourse.testsDone.forEach(test=>{
            if(test.test.toString()===req.params.testId.toString()){
                marksScored = test.marksScored    
                done = true;
            }
        })
        if(!done){
            test = await Test.findOne({_id:req.params.testId}).populate({path:'questions',select:'-correctAns'})
            // console.log(test)
            if(test){
                res.status(200).json({done: true,test})
            }else{
                res.status(422).json({done: false,message: 'test not found'})
            }
        }else{
            if(marksScored>0){
                res.status(200).json({done: true,message: 'you have attempted this Test and your marks are out',marksScored})
            }else{
                res.status(200).json({done: true,message: 'you have attempted this Test Teacher will evaluate'})
            }
        }
    } catch (error) {
        console.log(error);
    }
})
router.get("/enrolled-course/:userId/course/:courseId/assignment/:assignmentId",async (req,res)=>{
    try {

        enrolledCourse = await CourseEnrolled.findOne({user : req.params.userId, course:req.params.courseId})
        var done = false,attemptsLeft=3,marksScored=-1
        enrolledCourse.assignmentsDone.forEach(ass=>{
            if(ass.assignment.toString()===req.params.assignmentId.toString()){
                attemptsLeft=ass.attemptsLeft
                marksScored = ass.marksScored
                if(ass.attemptsLeft>0)
                {
                    marksScored = ass.marksScored
                    attemptsLeft = ass.attemptsLeft
                    done = true;
                }
            }
        })
        if(done){
            const assignment = await Assignment.findOne({_id:req.params.assignmentId}).populate('questions')
            
            if(assignment){
                res.status(200).json({done: true,assignment,marksScored,attemptsLeft})
            }else{
                res.status(422).json({done: false,message: 'assignment not found'})
            }
        }else if(!done && attemptsLeft===3){
            const assignment = await Assignment.findOne({_id:req.params.assignmentId}).populate('questions')
            
            if(assignment){
                res.status(200).json({done: true,assignment,attemptsLeft})
            }else{
                res.status(422).json({done: false,message: 'assignment not found'})
            }
        }
        else{
            res.status(200).json({done: true,message: 'no attempts left in this assignment',marksScored})
        }
      
    } catch (error) {
        console.log(error);
    }
})
// focus on removing previous assign
router.post('/enrolled-course/:userId/course/:courseId/assignment/:assignmentId',async (req,res)=>{
    try {
        const {marksScored} = req.body
        enrolledCourse = await CourseEnrolled.findOne({user : req.params.userId, course:req.params.courseId})
        var done = false,attemptsLeft
        for(var ass of enrolledCourse.assignmentsDone){
            if(ass.assignment.toString()===req.params.assignmentId.toString()){
                ass.marksScored = marksScored
                if(ass.attemptsLeft>0){
                    ass.attemptsLeft = ass.attemptsLeft - 1
                }else{
                    ass.attemptsLeft = 0
                }
                done = true;
            }
        }
        if(!done){
            enrolledCourse.assignmentsDone.push({assignment:req.params.assignmentId, marksScored:marksScored,attemptsLeft:2})
        }
        enrolledCourse.save(err=>{
            if(err){
                console.log(err)
                return;
            }
        })
        // console.log(enrolledCourse)
        res.status(200).json({done: true,message: 'Successfully saved the Assignment'})
    } catch (error) {
        console.log(error);
    }
})

router.post('/submit-response/user/:userId/test/:testId/question/:questionId',async (req,res)=>{
    try {
        const {response} = req.body
        const prevSaved = await Response.findOne({questionId : req.params.questionId , userId:req.params.userId ,testId:req.params.testId})
        if(prevSaved){
            await Response.deleteOne({questionId : req.params.questionId , userId:req.params.userId ,testId:req.params.testId})    
        } 
        const savedResponse = await Response.create({questionId : req.params.questionId , userId:req.params.userId ,testId:req.params.testId, response})
        res.status(200).json({done:true,message:"response saved"})
    } catch (error) {
        console.log(error);
    }
})

//to be add logic of response//add eacch question in response and then add into array of responses
router.post('/enrolled-course/:userId/course/:courseId/test/:testId',async (req,res)=>{
    try {
        const responsesArray = await Response.find({testId : req.params.testId , userId:req.params.userId}).select("_id")
        var responses=[];
        responsesArray.forEach((response)=>{
            responses.push(response._id)
        })
        const savedResponseSheet = await ResponseSheet.create({testId : req.params.testId , studentId:req.params.userId,responses})
        enrolledCourse = await CourseEnrolled.findOne({user : req.params.userId, course:req.params.courseId})
        enrolledCourse.testsDone.push({test:req.params.testId, responseSheet:savedResponseSheet._id,})
        enrolledCourse.save(err=>{
            if(err){
                console.log(err)
                return;
            }
        })
        res.status(200).json({done: true,message: 'Successfully saved the Test'})
    } catch (error) {
        console.log(error);
    }
})
// if onclick lecture is not considered done 
router.post('/enrolled-course/:userId/course/:courseId/lecture/:lectureId',async (req,res)=>{
    try {
        enrolledCourse = await CourseEnrolled.findOne({user : req.params.userId, course:req.params.courseId})
        enrolledCourse.lecturesDone.push(req.params.lectureId)
        enrolledCourse.save(err=>{
            if(err){
                console.log(err)
                return;
            }
        })
        res.status(200).json({done: true,message: 'Successfully saved the lecture'})
    } catch (error) {
        console.log(error);
    }
})

module.exports=router
