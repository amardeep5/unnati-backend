const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const jwt_secret=process.env.JWT_SECRET;

router.post("/login",async (req,res)=>{
  const {password,email} = req.body
  if(!password || !email){
      res.status(422).json({error:"Password or Email is missing",done:false})
  }else{
      try {
          const savedUser = await User.findOne({email})
          if(!savedUser){
            res.status(422).json({error:"Password or Email is incorrect",done:false}) 
          }else{
              const passwordMatched = bcrypt.compare(password,savedUser.password)
              if(passwordMatched){
                const token = jwt.sign({_id:savedUser._id},jwt_secret) 
                const {username,email,_id,firstName,lastName,phoneNumber,role}=savedUser;
                if(role==='STUDENT'){
                    if(savedUser.isTeacherApproved || savedUser.isAdminApproved){
                        res.json({message:"Signed IN",token,user:{username,email,_id,firstName,lastName,phoneNumber,role},done:true})
                    }else if(savedUser.isTeacherRejected || savedUser.isAdminRejected){
                        res.json({message:"Your Application is Rejected",user:{username,email,_id,firstName,lastName,phoneNumber,role},done:true})
                    }else{
                        res.json({message:"Your Application is under process process",user:{username,email,_id,firstName,lastName,phoneNumber,role},done:true})
                    }
                }else if(role==='TEACHER'){
                    if(savedUser.isAdminApproved){
                        res.json({message:"Signed IN",token,user:{username,email,_id,firstName,lastName,phoneNumber,role},done:true})   
                    }else{
                        if(savedUser.isAdminRejected){
                            res.json({message:"Your Application is Rejected",user:{username,email,_id,firstName,lastName,phoneNumber,role},done:true})  
                        }else{
                            res.json({message:"Your Application is under Process",user:{username,email,_id,firstName,lastName,phoneNumber,role},done:true})
                        }   
                    }
                }else{
                    res.json({message:"Signed IN",token,user:{username,email,_id,firstName,lastName,phoneNumber,role},done:true})
                }  
              }else{
                res.status(422).json({error:"Password or Email is incorrect",done:false}) 
              }
          }
      } catch (error) {
          console.log(error)   
      } 
  }
})


router.post("/signup",async (req,res)=>{
    const {username,email,password,role,firstName,lastName,phoneNumber,cafe}=req.body;
    if(!email || !password || !username || !firstName || !lastName || !phoneNumber || !role || !cafe){
        res.status(422).json({error:"Please add all the details",done:false})
    }else{ 
        try {
            const savedUser=await User.findOne({email})
            if(savedUser){
                res.status(422).json({error:"User already exists",done:false})
            }else{
                try {
                    const hashedPassword = await bcrypt.hash(password,12)
                    if(role==='TEACHER'){
                       teacherExist = await User.findOne({role: 'TEACHER',cafe})
                       if(teacherExist){
                        res.json({error:"Teacher already exist in this cafe ",done:false})
                       }else{
                        const newUser = await User.create({email,username,password:hashedPassword,role,firstName,lastName,phoneNumber,cafe})
                        res.json({message:"User created",user:newUser,done:true})
                       }
                    }
                    else{
                        const newUser = await User.create({email,username,password:hashedPassword,role,firstName,lastName,phoneNumber,cafe})
                        res.json({message:"User created",user:newUser,done:true})
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
})

module.exports=router