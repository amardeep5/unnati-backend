const { response } = require('express');
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
const Cafe = mongoose.model('Cafe');
const Assignment = mongoose.model('Assignment');
const CourseEnrolled = mongoose.model('CourseEnrolled');
const authenticate = require('./../../middleware/authenticate')
const restrictTo = require('./../../middleware/restrictTo')

router.post("/cafeStudents/:cafeId",authenticate,restrictTo("TEACHER"),async (req,res) => {
    try {
        let response = {
            message:"information of cafe",
            done:true,
            arr: []
        }
        const students = await User.find({cafe:req.params.cafeId,role:'STUDENT'}).select("_id firstName lastName phoneNumber email")
        students.forEach(student => {
            const currId = student._id;
            const courses = await CourseEnrolled.find({user:currId}).select("_id course")
            let arrCourses = []
            courses.forEach(course => {
                const courseId = course.course.type
                const courseDetails = await Course.findOne({_id:courseId})
                arrCourses.push(courseDetails)
            })
            arr.push({
                firstName: student.firstName,
                lastName: student.lastName,
                phoneNumber: student.phoneNumber,
                email: student.email,
                courses : arrCourses
            })
        });
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
    }
})

// request answer sheet for evaluation
router.post("/requestTestEvaluate/:responseSheetId",authenticate,restrictTo("TEACHER"),async (req,res) => {
    try {
        data = await ResponseSheet.findById({_id: req.params.responseSheetId}).populate({
            path: 'Test',
            populate: { path: 'Question'}
          }, {
            path: 'Response',
          });
        res.status(200).json({message:'Test and response details',done:true,data:data})
    } catch (error) {
        console.log(error);
    }
})


// add score to the database
router.post("/evaluateTest/:responseSheetId",authenticate,restrictTo("TEACHER"),async (req,res) => {
    try {
        responseSheet = await ResponseSheet.findById({_id: req.params.responseSheetId})
        responseSheet.score = req.body.score
        responseSheet.save(function (err) {
            if (err){
                console.log(err);
                return;
            }  
            res.status(200).json({message:"Marks are added!",done:true});
        }); 
    } catch (error) {
        console.log(error);
    }
})


router.post("/loadPendingEvaluations/:cafeId/course/:courseId",authenticate,restrictTo("TEACHER"),async (req,res) => {
    try {
        let response = {
            message:"list of pending evaluations",
            done:true,
        }

        let pendingUsers = await CourseEnrolled.find({course:req.params.courseId}).populate({
            path: 'user'
        })

        res.status(200).json(response)
    } catch (error) {
        console.log(error);
    }
})

module.exports=router