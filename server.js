const express = require('express');
const mongoose = require('mongoose');
const userRoute =require('./routes/userRoutes');
const roomRoute = require("./routes/roomRoute");
const bookingRoute =require('./routes/bookingRoute');
const reviewRoute =require('./routes/reviewRoute')

const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config()

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.use('/apiUser',userRoute);
app.use("/apiRoom",roomRoute);
app.use('/apiBooking',bookingRoute);
app.use('/apiReview',reviewRoute)

mongoose.connect(process.env.MONGODB).then(()=>{
console.log(`connected to MONGODB`);
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT} 
        \ncloud_name: ${process.env.CLOUDINARY_CLOUD_NAME} 
        \napi_key: ${process.env.CLOUDINARY_API_KEY} 
        \napi_secret: ${process.env.CLOUDINARY_API_SECRET}`)
})
}).catch((err)=>{
    console.log(`Error in connecting MongoDB - ${err}`)
})
