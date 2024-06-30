const express = require('express');
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/User');

const router = express.Router();

//register endpoint
router.post('/register', async(req,res)=>{
    const {name,email,password,role} = req.body;
    try {
        const exitingUser = await User.findOne({email});
        if(exitingUser){
           return res.status(400).send('User already exists');
        }
        const hashedPassword = bcrypt.hashSync(password,10);
        const newUser = new User({name,email,password : hashedPassword,role});
        await newUser.save();
        res.status(200).send('User registered successdully');
    } catch (error) {
        res.status(400).send('Error in regsitering User');
    }
})


//login endpoint
router.post('/login',async(req,res) =>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        const isMatch = await bcrypt.compare(password,user.password);
        if(!user || !isMatch) return res.status(400).json({message :"invalid credentials"});
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token});
    } catch (error) {
        res.status(400).json({message :error.message});
    }
})
module.exports =router;