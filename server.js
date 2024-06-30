const express = require('express');
const mongoose = require('mongoose');
const userRoute =require('./routes/userRoutes')
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config()

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.use('/apiUser',userRoute);


mongoose.connect(process.env.MONGODB).then(()=>{
console.log(`connected to MONGODB`);
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
}).catch((err)=>{
    console.log(`Error in connecting MongoDB - ${err}`)
})
