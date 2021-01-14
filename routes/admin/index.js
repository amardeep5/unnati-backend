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

router.get("/course-fees/:courseId",/*authenticate,restrictTo("ADMIN"),*/async (req,res) => {
    try {
        const course = await Course.findOne({_id:req.params.courseId}).populate({path:'fees.cafe'}).select("fees")
        if(course){
            res.status(200).json({message:" All cafes fees ",done:true,course});
        }else{
            res.status(402).json({error:" No cafe found",done:false});
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/cafe-list",/*authenticate,restrictTo("ADMIN"),*/async (req,res) => {
    try {
        const cafes = await Cafe.find({})
        if(cafes){
            res.status(200).json({message:" All cafe list ",done:true,cafes});
        }else{
            res.status(402).json({error:" No cafe found",done:false});
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/teacherApproval/:id",/*authenticate,restrictTo("ADMIN"),*/async (req,res) => {
    try {
        const teacher = await User.findById({_id: req.params.id})
        if(teacher){
            if(teacher.role!=='TEACHER'){
                res.status(402).json({error:" Not A Teacher ",done:false});
            }
            else{
                teacher.isAdminApproved=true
                teacher.save(function (err) {
                    if (err){
                        console.log(err);
                        return;
                    }  
                    res.status(200).json({message:"teacher approved",done:true});
                }); 
            }   
        }
    } catch (error) {
        console.log(error);
    }
})
router.post("/studentApproval/:id",/*authenticate,restrictTo("ADMIN","TEACHER"),*/async (req,res) => {
    try {
        const student = await User.findById({_id: req.params.id})
        if(student){
            if(student.role!=='STUDENT'){
                res.status(402).json({error:" Not A student ",done:false});
            }
            else{
                student.isAdminApproved=true
                student.isTeacherApproved=true
                student.save(function (err) {
                    if (err){
                        console.log(err);
                        return;
                    }  
                    res.status(200).json({message:"student approved",done:true});
                });  
            }  
        }
    } catch (error) {
        console.log(error);
    }
})


router.post("/teacherRejection/:id",/*authenticate,restrictTo("ADMIN"),*/async (req,res) => {
    try {
        const teacher = await User.findById({_id: req.params.id})
        if(teacher){
            if(teacher.role!=='TEACHER'){
                res.status(402).json({error:" Not A Teacher ",done:false});
            }
            else{
                teacher.isAdminRejected=true
                teacher.save(function (err) {
                    if (err){
                        console.log(err);
                        return;
                    }  
                    res.status(200).json({message:"teacher rejected",done:true});
                }); 
            }   
        }
    } catch (error) {
        console.log(error);
    }
})
router.post("/studentRejection/:id",/*authenticate,*/restrictTo("ADMIN","TEACHER"),async (req,res) => {
    try {
        const student = await User.findById({_id: req.params.id})
        if(student){
            if(student.role!=='STUDENT'){
                res.status(402).json({error:" Not A student ",done:false});
            }
            else{
                student.isAdminRejected=true
                student.isTeacherRejected=true
                student.save(function (err) {
                    if (err){
                        console.log(err);
                        return;
                    }  
                    // saved!
                    res.status(200).json({message:"student rejected",done:true});
                });
                }
        }    
    } catch (error) {
        console.log(error);
    }
})

router.get("/waitingList-teacher",/*authenticate,restrictTo("ADMIN"),*/async (req,res) => {
    try {
        teachers = await User.find({role:'TEACHER',isAdminApproved:false,isAdminRejected:false})
        res.status(200).json({message:" waiting teachers ",done:true,teachers});
    } catch (error) {
        console.log(error);
    }
})
router.get("/waitingList-student",/*authenticate,restrictTo("ADMIN"),*/async (req,res) => {   
    try {
        students = await User.find({role:'STUDENT',isTeacherApproved:false,isTeacherRejected:false})
        res.status(200).json({message:" waiting students ",done:true,students});
    } catch (error) {
        console.log(error);
    }
})

router.post("/create-cafe",/*authenticate,restrictTo("ADMIN"),*/async (req,res)=>{
    const {location,address,name}=req.body;
    if(!location||!address||!name){
        res.status(422).json({error:" location or address missing",done:false});
    }
    else{
        try {
            const cafe = await Cafe.create({location,address,name})
            res.status(200).json({message:" cafe created",done:true,cafe});
        } catch (error) {
            console.log(error);
        }
    }
})
router.get("/getAll-cafe",async (req,res)=>{
     try {
        const cafes = await Cafe.find({});
        res.status(200).json({message:"List of all cafes",done:true,cafes});
     } catch (err) {
        console.log(err);
        res.status(422).json({error:"Something went wrong",done:false});
     }
})
router.get("/cafeInfo/:cafeId",/*authenticate,restrictTo("ADMIN"),*/async (req,res)=>{
    try {
        const cafe = await Cafe.findById({_id:req.params.cafeId});
        const teacher = await User.find({cafe:req.params.cafeId,role:'TEACHER'}).select("_id username firstName lastName phoneNumber email")
        const students = await User.find({cafe:req.params.cafeId,role:'STUDENT'}).select("_id firstName lastName phoneNumber email")
        res.status(200).json({message:"information of cafe",done:true,cafe,teacher,students});
    } catch (error) {
        console.log(error);
    }
})
router.get("/detailedInfo/:userId",/*authenticate,restrictTo("ADMIN"),*/async (req,res)=>{
    try {        
        const student = await User.find({_id:req.params.userId,role:'STUDENT'}).select("-password -teacherAccessCourses")
        res.status(200).json({message:"detailed info of student", done:true,student});
    } catch (error) {
        console.log(error);
    }
})
//give course access to selected teacher
router.post("/courseAccess/:userId/course/:courseId",/*authenticate,restrictTo("ADMIN"),*/async (req,res) => {
    try {
        const teacher = await User.findOne({_id: req.params.userId,role:'TEACHER'});
        for (const id of teacherAccessCourses) {
            if(id.toString()===req.params.courseId.toString()){
                res.status(422).json({message:`access has already been given to teacher ${teacher.firstName}`,done:false});
                return
            }
        }
        teacher.teacherAccessCourses.push(req.params.courseId);
        teacher.save(function (err) {
            if (err){
                console.log(err);
                return;
            }  
            res.status(200).json({message:`access given to teacher ${teacher.firstName}`,done:true});
          });  
    } catch (error) {
        console.log(error);   
    }
})
router.post("/removeAccess/:userId/course/:courseId",/*authenticate,restrictTo("ADMIN"),*/async (req,res) => {
    try {
        const teacher = await User.findOne({_id: req.params.userId,role:'TEACHER'});

        teacher.teacherAccessCourses = teacher.teacherAccessCourses.filter(function(item) {
            return item.toString() !== req.params.courseId.toString()
        })
        teacher.save(function (err) {
            if (err){
                console.log(err);
                return;
            }  
            res.status(200).json({message:`access removed for teacher ${teacher.firstName}`,done:true});
          });  
    } catch (error) {
        console.log(error);   
    }
}) 
router.post("/create-question",/*authenticate,restrictTo("ADMIN"),*/ async (req, res) => {
    const {correctAns,type,name,statement,options,maxMarks}=req.body
    if(!type||!statement||!maxMarks|| !name){
        res.status(422).json({error:" fill all the fields",done:false});
    }
    else{
        try {
            const quest = Question.create({correctAns,type,name,statement,options,maxMarks});
            res.status(200).json({message:'question created',done:true,quest});
        } catch (error) {
         console.log(error);   
        }
    }

})
router.post("/create-assignment",/*authenticate,restrictTo("ADMIN"),*/ async (req, res) => {
    const {assignmentName,duration,maxMarks,questions}=req.body
    if(!assignmentName||!duration||!maxMarks||!questions){
        res.status(422).json({error:" fill all the fields",done:false});
    }
    else{
        try {
            const ass = Assignment.create({assignmentName,duration,maxMarks,questions});
            res.status(200).json({message:'Assignment created',done:true,ass});
        } catch (error) {
         console.log(error);   
        }
    }

})
router.post("/create-test",/*authenticate,restrictTo("ADMIN"),*/ async (req, res) => {
    const {testName,duration,maxMarks,questions}=req.body
    if(!testName||!duration||!maxMarks||!questions){
        res.status(422).json({error:" fill all the fields",done:false});
    }
    else{
        try {
            const test=Test.create({testName,duration,maxMarks,questions});
            res.status(200).json({message:'Test created',done:true,test});
        } catch (error) {
         console.log(error);   
        }
    }

})
router.post("/create-topic",/*authenticate,restrictTo("ADMIN"),*/ async (req, res) => {
    const {courseName,topicName,contentOrder}=req.body
    if(!courseName||!topicName||!contentOrder){
        res.status(422).json({error:" fill all the fields",done:false});
    }
    else{
        try {
            const topic=Topic.create({courseName,topicName,contentOrder});
            res.status(200).json({message:'Topic created',done:true,topic});
        } catch (error) {
         console.log(error);   
        }
    }
})
router.post("/create-course",/*authenticate,restrictTo("ADMIN"),*/ async (req, res) => {
    const {courseName,topics,fees,summary}=req.body
    if(!courseName||!topics||!fees){
        res.status(422).json({error:" fill all the fields",done:false});
    }
    else{
        try {
            const course=Course.create({courseName,topics,fees,summary});
            res.status(200).json({message:'Course created',done:true,course});
        } catch (error) {
         console.log(error);   
        }
    }

})
//fetch all courses
router.get('/courses',/*authenticate,*/restrictTo("ADMIN","TEACHER"),async (req,res)=>{
    try {
        const courses = await Course.find({}).populate({
            path: 'topics',
            select:'topicName contentOrder _id',
          })
        res.status(200).json({message:'Course list',done:true,courses});
    } catch (error) {
        console.log(error)
    }
})

//add or update fees option for particular area 
router.post("/courseFees/:courseId/cafe/:cafeId",/*authenticate,restrictTo("ADMIN"),*/ async (req, res) => {
    const {amount}=req.body
    if(!amount){
        res.status(422).json({error:" provide a amount ",done:false});
    }
    else{
        try {
            var course= await Course.findOne({_id:req.params.courseId});
            //console.log(course);
            course.fees = course.fees.filter(function(item) {
                return item.cafe.toString() !== req.params.cafeId.toString()
            })
            course.fees.push({
                cafe:req.params.cafeId,
                amount:amount
            })
            course.save(function (err) {
                if (err){
                    console.log(err);
                    return;
                }  
                res.status(200).json({message:'Course fees created or updated for cafe',done:true,fees:course.fees});
              });  
            
        } catch (error) {
         console.log(error);   
        }
    }
}) 
//update info of users
router.post('/updateUser/:userId',/*authenticate,restrictTo("ADMIN"),*/async (req,res) => {
    const {username,email,role,firstName,lastName,phoneNumber,cafe} = req.body
    try {
        const user = await User.findOne({_id: req.params.userId})
        if(user){
            user.username=username
            user.email=email
            user.role=role
            user.firstName=firstName
            user.lastName=lastName
            user.phoneNumber=phoneNumber
            user.cafe=cafe
            user.save(function (err) {
                if (err){
                    console.log(err);
                    return;
                }  
                res.status(200).json({message:'user updated',done:true,user});
              });  
        }
        else{
            res.status(422).json({error:'user doesnt exist',done:false});
        }
    } catch (error) {
        console.log(error)
    }
})
//find all receipts
router.get('/receipts/:userId',/*authenticate,restrictTo("ADMIN"),*/async (req,res) => {
    try {
        const receipts = await User.findById({_id: req.params.userId}).populate({
            path: 'receipts',
            populate: { path: 'courseEnrolled', select: 'subjectCode subjectName courseName _id summary' }
          }).select('receipts');  
          res.status(200).json({message:'user receipts',done:true,receipts:receipts.receipts});   
    } catch (error) {
        console.log(error)
    }
})
// router.post('/generateReceipt/:userId/course/:courseId',/*authenticate,restrictTo("ADMIN"),*/async (req,res) => {
//     try {
//         user = await User.findById({_id: req.params.userId})
//         const {amount,name}=req.body
//         //if amount in suffiecient then
//         //const name = `${user.firstName} ${user.lastName}` 
//         receipt = await Receipt.create({amount,name,courseEnrolled:req.params.courseId})
//         Receipt.create({amount,name,courseEnrolled:req.params.courseId}, function(err, newReceipt) {
//              if (err) {
//                  console.log(err);
//              } else {
//                 user.receipts.push(newReceipt._id)
//                 user.save(function (err) {
//                     if (err){
//                         console.log(err);
//                         return;
//                     }  
//                     res.status(200).json({message:'user receipt geneerated',done:true,receipt});   
//                   });  
//              }
//          });         
//     } catch (error) {
//         console.log(error)
//     }
// })
router.post('/deleteUser/:userId',async (req,res)=>{
    try {
        const deletedUser = await User.findByIdAndDelete({_id: req.params.userId})
        res.status(200).json({message:'user deleted',done:true})
    } catch (error) {
        console.log(error)
    }
})
//lecture creation
router.post("/create-lecture",/*authenticate,restrictTo("ADMIN"),*/ async (req, res) => {
    const {driveId,name,noteId}=req.body
    if(!driveId|| !name){
        res.status(422).json({error:" fill all the fields",done:false});
    }
    else{
        try {
            const lecture =Lecture.create({driveId,name,noteId});
            res.status(200).json({message:'Lecture created',done:true,lecture});
        } catch (error) {
         console.log(error);   
        }
    }
})
module.exports=router
