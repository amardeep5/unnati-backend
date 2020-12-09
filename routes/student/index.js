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
        }).select("subjectCode subjectName courseName summary topics fees")
        var cafeFee=0
        course.fees.forEach(async (fee)=>{
            if(fee.cafe.toString() === req.params.cafeId.toString()){
                cafeFee = fee.amount;
                // console.log(fee.amount)
            }
        })
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
// all user past receipts 
router.get("/user-receipts/:userId",async (req,res)=>{
    try {
        const userReceipts = await User.findOne({_id: req.params.userId}).populate({path:'receipts', populate:{path:'courseEnrolled',select:'courseName'}}).select('receipts')
        res.status(200).json({done: true,userReceipts,message:'All User Receipts'})
    } catch (error) {
        console.log(error);
    }

})
// fees status of each enrolled course of a user
router.get("/coursesFeesStatus/:userId/cafe/:cafeId",async (req,res)=>{
    try {
        const courses = await CourseEnrolled.find({user: req.params.userId}).populate({path:'course',select:'courseName fees'}).select('course feesPaid')
        courses.forEach(course => {
            course.fees.forEach(fee => {
                if(fee.cafe.toString()===req.params.cafeId.toString()){
                    course.fees = fee.amount
                }
            })
        })
        res.status(200).json({done: true,courses,message:'All User enrolled courses fees Status'})
    } catch (error) {
        console.log(error);
    }

})
// enroll a user in a course 
router.post("/user/:userId/courseEnroll/:courseId",async (req,res)=>{
    const course = await CourseEnrolled.create({user:req.params.userId,course:req.params.courseId})
    const user = await User.findOne({_id:req.params.userId})
    user.coursesEnrolled.push(course._id)
    user.save(err => {
        if(err){
            console.log(err)
            return
        }
    })
    res.status(200).json({done: true,message:'User enrolled in courses'})
})
// pay fees of a course and add it to receipts of user
router.post("/user/:userId/courseFeeUpdate/:courseId",async (req,res)=>{
    const course = await CourseEnrolled.findOne({user:req.params.userId,course:req.params.courseId})
    course.feesPaid = true
    course.save(err => {
        if(err){
            console.log(err)
            return
        }
    })
    const {amount,name} = req.body
    const receipt = await Receipt.create({amount,name,courseEnrolled:req.params.courseId})
    const user = await User.findOne({_id:req.params.userId})
    user.receipts.push(receipt)
    user.save(err => {
        console.log(err)
        return
    })
    res.status(200).json({done: true,message:'User enrolled  course fees paid '})
})
// list of all enrolled courses
router.get("/enrolled-courses/:userId",async (req,res) => {
    try {
        const userCourses = await User.find({_id: req.params.userId}).populate({
            path:'courseEnrolled',
            populate : {
                path: 'course' , 
                select: '_id courseName'
            }
        }).select("courseEnrolled")
        if(userCourses){
            var percentStatus = [];

            for (const userCourse of userCourses){
                const course = await Course.findOne({_id: userCourse._id}).populate({
                    path: 'topics',
                    select:'_id topicName contentOrder',
                }).select("subjectCode subjectName courseName summary topics")
                var totalLength = 0,calcLength=0;
                for(const topic of courses.topics){
                    totalLength = totalLength + topic.contentOrder.length;
                }
                courseEnrolled = await CourseEnrolled.findOne({user : req.params.userId, course:userCourse._id})
                if(courseEnrolled){
                    calcLength = calcLength + courseEnrolled.assignmentsDone.length + courseEnrolled.testsDone + courseEnrolled.lecturesDone
                }
                var percentDone = (calcLength / totalLength)*100 
                percentStatus.push(percentDone);
            }
            res.status(200).json({done: true,userCourses, percentStatus,message:'All User Courses with ids'})
        }else{
            res.status(422).json({done: false,message: 'User not found'})
        }
        
    } catch (error) {
        console.log(error);
    }
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// opens the details of a course like lecture , tests and assignment
router.get("/enrolled-course/:userId/course/:courseId",async (req,res) => {
    try {
        const course = await Course.findOne({_id: req.params.courseId}).populate({
            path: 'topics',
            select:'_id topicName contentOrder',
        }).select("courseName topics")
    
        res.status(200).json({done: true,course})
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
            try {
                enrolledCourse = await CourseEnrolled.findOne({user : req.params.userId, course:req.params.courseId})
                enrolledCourse.lecturesDone.push(lectureId)
                enrolledCourse.save(err=>{
                    if(err){
                        console.log(err)
                        return;
                    }
                })
            } catch (error) {
                console.log(error);
            }
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
                marksScored = test.markScored    
                done = true;
            }
        })
        if(!done){
            test = await Test.findOne({_id:req.params.testId}).populate({path:'questions',select:'-correctAns'})
            console.log(test)
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
                ass.attemptsLeft = ass.attemptsLeft - 1
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
        enrolledCourse.lecturesDone.push(lectureId)
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