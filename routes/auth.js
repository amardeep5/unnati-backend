const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
// require('dotenv').config()
const jwt_secret=process.env.JWT_SECRET;
console.log(typeof(process.env.JWT_SECRET),typeof(jwt_secret));


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
                const {username,email,_id,role,firstName,lastName,phoneNumber}=savedUser;
                if(role==='STUDENT'){
                    res.json({message:"Signed IN",token,user:{username,email,_id,firstName,lastName,phoneNumber},done:true})
                }else if(role==='ENTREPRENEUR'){
                    if(savedUser.isAdminApproved){
                        res.json({message:"Signed IN",token,user:{username,email,_id,firstName,lastName,phoneNumber},done:true})   
                    }else{
                        if(isRejected){
                            // User.deleteOne({ _id: savedUser._id }, function (err) {
                            //     if (err){
                            //         console.log(err)
                            //         return ;
                            //     } 
                            //   });
                            res.json({message:"Your Application is Rejected",done:true})  
                        }else{
                            res.json({message:"Your Application is under Process",done:true})
                        }   
                    }
                }else{
                    res.json({message:"Signed IN",token,user:{username,email,_id,firstName,lastName,phoneNumber},done:true})
                }  
              }else{
                res.status(422).json({error:"Password or Email is incorrect",done:false}) 
              }
            //   console.log(req.user);
          }
      } catch (error) {
          console.log(error)   
      }
  }
})


router.post("/signup",async (req,res)=>{
    const {username,email,password,role,firstName,lastName,phoneNumber}=req.body;
    if(!email || !password || !username || !firstName || !lastName || !phoneNumber || !role){
        res.status(422).json({error:"Please add all the details",done:false})
    }else{
        try {
            const savedUser=await User.findOne({email})
            if(savedUser){
                res.status(422).json({error:"User already exists",done:false})
            }else{
                try {
                    const hashedPassword = await bcrypt.hash(password,12)
                    const newUser = await User.create({email,username,password:hashedPassword,role,firstName,lastName,phoneNumber})
                    res.json({message:"User created",user:newUser,done:true})
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