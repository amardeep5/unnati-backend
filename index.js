const express = require('express')
const app = express()
const mongoose= require('mongoose')
const cors=require('cors');

require('dotenv').config()
require('./models/user');
require('./models/question_paper');
require('./models/test_response');
const User = mongoose.model('User');
const authenticate = require('./middleware/authenticate')
const restrictTo = require('./middleware/restrictTo')
app.use(cors());
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/evaluation'))

app.get("/",authenticate,(req,res)=>{
    res.send("its Protected")
})

app.get("/admin",authenticate,restrictTo("ADMIN"),async (req,res)=>{
    try {
        const waitingEntrpnr = await User.find({role:"ENTREPRENEUR",isAdminApproved:false}).select("-password");
        res.json({waitngList:waitingEntrpnr,done:true})
    } catch (error) {
        console.log(error);
    }
})

mongoose.connect(process.env.MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo");
})
mongoose.connection.on('err',()=>{
    console.log("error while connecting",err);
})
app.listen('3001',()=>{
    console.log("server running at port 3001" )
})