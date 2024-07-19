const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const { route } = require("./userRoutes");
const multer =require("multer") 
const cloudinary = require("../config/cloudinary");
require("dotenv").config;

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/addRoom",upload.array("media"), async (req,res)=>{
    const {name,location,phonenumber,maxcount,rentperday,description} = req.body;

    try {
        const mediaUrls = await Promise.all(
            req.files.map(async (file) =>{
            return  new Promise((resolve,reject)=>{
                const uploadStream = cloudinary.uploader.upload_stream(
                {
                  resource_type :"auto",        
                },
                (error,result)=>{
                    if(error) return reject(error);
                    resolve(result.secure_url);
                });
                uploadStream.end(file.buffer);
            });
        })
    );
        const newRoom = new Room({
            name,
            location,
            phonenumber,
            maxcount,
            rentperday,
            description,
            images : mediaUrls.filter((url) =>{
                return url.endsWith(".jpg") || url.endsWith(".png")
        })
        });
        await newRoom.save();
        res.json({message :'room added successfully'});
    } catch (error) {
        console.log(error);
        res.json({message: error.message});
    }
});

router.get("/getRooms", async (req,res)=>{
    try {
        const rooms = await Room.find({});
        res.status(200).json(rooms);
    } catch (error) {
        res.status(400).json('error in getting rooms');
    }
})

module.exports=router;