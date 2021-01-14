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

router.get("/cafeStudents/:cafeId",/*authenticate,restrictTo("TEACHER"),*/async (req,res) => {
    try {
        let response = {
            message:"information of cafe",
            done:true,
            arr: []
        }
        const students = await User.find({cafe:req.params.cafeId,role:'STUDENT'}).select("_id firstName lastName phoneNumber email")
        for (const student of students) {
            const currId = student._id;
            const courses = await CourseEnrolled.find({user:currId}).populate({
                path:'course', select:'courseName summary'
            }).select("_id course")
            response.arr.push({
                _id:student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                phoneNumber: student.phoneNumber,
                email: student.email,
                courses : courses
            })   
        }
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
    }
})

// request answer sheet for evaluation
router.get("/requestTestEvaluate/:responseSheetId",/*authenticate,restrictTo("TEACHER"),*/async (req,res) => {
    try {
        data = await ResponseSheet.findById({_id: req.params.responseSheetId}).populate([{
            path: 'testId',
            populate: { path: 'questions'}
          }, {
            path: 'responses',
            populate: { path: 'questionId'}
          }]);
        res.status(200).json({message:'Test and response details',done:true,data:data})
    } catch (error) {
        console.log(error);
    }
}) 


// add score to the database
router.post("/evaluateTest/student/:studentId/course/:courseId/test/:testId"/*,authenticate,restrictTo("TEACHER")*/,async (req,res) => {
    try {
        course = await CourseEnrolled.findOne({user: req.params.studentId,course:req.params.courseId})
        for (var test of course.testsDone) {
            if(test.test.toString()===req.params.testId.toString()){
                test.marksScored = req.body.marksScored
                course.save()
                res.status(200).json({message:"Marks are added!",done:true,course});
                return 
            }
        }
        
             
    } catch (error) {
        console.log(error);
    }
})


router.get("/loadPendingEvaluations/:cafeId",/*authenticate,restrictTo("TEACHER"),*/async (req,res) => {
    try {
        let response = {
            message:"list of pending evaluations",
            done:true,
        }

        let users = await User.find({cafe:req.params.cafeId,role:'STUDENT'}).populate({
            path: 'coursesEnrolled',
            populate: [{path:'course', select:'courseName'},{path:'testsDone.test', select:'testName'}],
            select:'testsDone'
        }).select('firstName lastName username _id ')
        for (const user of users) {
            for (const course of user.coursesEnrolled) {
                course.testsDone = course.testsDone.filter(obj=>{
                    return obj.marksScored===-1
                })
            }
        }
        response.pendingEvaluations = users

        res.status(200).json(response)
    } catch (error) {
        console.log(error);
    }
})
// enroll a user in a course 
router.post("/user/:userId/cafe/:cafeId/courseEnroll/:courseId",async (req,res)=>{
    const c =  await Course.findOne({_id: req.params.courseId})
    var user = await User.findOne({_id:req.params.userId})
    c.fees.forEach(fee =>{
        if(fee.cafe.toString()===req.params.cafeId.toString()){
            user.dueAmount= user.dueAmount + fee.amount
        }
    })
    const alreadyC = await CourseEnrolled.findOne({user:req.params.userId,course:req.params.courseId})
    if(alreadyC){
        res.status(200).json({done: false,error:'User already enrolled in  this course'})
    } 
    const course = await CourseEnrolled.create({user:req.params.userId,course:req.params.courseId})
    user.coursesEnrolled.push(course._id)
    user.save(err => {
        if(err){
            console.log(err)
            return
        }
    })
    // console.log(user.dueAmount)
    res.status(200).json({done: true,message:'User enrolled in course'})
})
// pay fees  add it to receipts of user
router.post("/user/:userId/feesUpdate",async (req,res)=>{
    // const course = await CourseEnrolled.findOne({user:req.params.userId,course:req.params.courseId})
    const {amount,remarks} = req.body
    const receipt = await Receipt.create({amount,remarks})
    var user = await User.findOne({_id:req.params.userId})
    user.receipts.push(receipt._id)
    if(user.dueAmount>amount){
        user.dueAmount = user.dueAmount - amount;
    }else{
        user.dueAmount = 0;
    }
    user.paidAmount = user.paidAmount + amount;
    user.save(err => {
        console.log(err)
        return
    })
    res.status(200).json({done: true,message:'User fees paid and receipt generated'})
})

// fees status of a user
router.get("/FeesStatus/user/:userId",async (req,res)=>{
    try {
        const user = await User.findOne({_id: req.params.userId}).select('paidAmount dueAmount')
    
        res.status(200).json({done: true,user,message:'User fees Status'})
    } catch (error) {
        console.log(error);
    }
})



//verified students
router.get("/verified-students/:cafeId",/*authenticate,restrictTo("ADMIN"),*/ async (req, res) => {
    try {
        let response = {
            message:"Verified students of cafe",
            done:true,
            arr: []
        }
        const students = await User.find({cafe:req.params.cafeId,role:'STUDENT'}).populate({
            path:'coursesEnrolled',
            populate: { path: 'course',select:'courseName'},
            select:'course'
        }).select("_id firstName lastName phoneNumber email isTeacherApproved isAdminApproved coursesEnrolled")
        for (const student of students) {
            if(student.isTeacherApproved===true || student.isAdminApproved===true ) {
                response.arr.push(student)
            }
        }
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
    }
})

//unverified students
router.get("/unverified-students/:cafeId",/*authenticate,restrictTo("ADMIN"),*/ async (req, res) => {
    try {
        let response = {
            message:"Unverified students of cafe",
            done:true,
            arr: []
        }
        const students = await User.find({cafe:req.params.cafeId,role:'STUDENT'}).select("_id firstName lastName phoneNumber email isTeacherApproved isAdminApproved")
        
        for (const student of students) {
            if(student.isTeacherApproved===false && student.isAdminApproved===false) {
                response.arr.push(student)
            }
        }
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
    }
})

module.exports=router