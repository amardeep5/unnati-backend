const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const Question_paper = mongoose.model('question_paper');

router.post("/load_all_paper_codes",async (req,res)=>{
    const {subjectCode} = req.body;
    if(!subjectCode){
        res.status(422).json({error:"Please enter the subject code",done:false})
    }else{
        try {
            const savedUser =await Question_paper.find({subjectCode})
            if(!savedUser){
                res.status(422).json({error:"No such subject",done:false})
            }else{
                obj = {
                    ids : []
                }
                savedUser.forEach(element => {
                    obj.ids.push(element._id)
                });
                res.json(obj)
            }
        } catch (error) {
            console.log(error)
        }
    }
})

router.post("/load_paper",async (req,res)=>{
    const _id = req.body.id;
    if(!_id){
        res.status(422).json({error:"Please enter the paper id",done:false})
    }else{
        try {
            const savedUser =await Question_paper.findOne({_id})
            if(!savedUser){
                res.status(422).json({error:"No such paper",done:false})
            }else{
                res.json(savedUser)
            }
        } catch (error) {
            console.log(error)
        }
    }
})

router.post("/submit_paper",async (req,res)=>{
    const _id = req.body.id;
    if(!_id){
        res.status(422).json({error:"Please enter the paper id",done:false})
    }else{
        try {
            const savedUser =await Question_paper.findOne({_id})
            if(!savedUser){
                res.status(422).json({error:"No such paper",done:false})
            }else{
                res.json(savedUser)
            }
        } catch (error) {
            console.log(error)
        }
    }
})

module.exports=router