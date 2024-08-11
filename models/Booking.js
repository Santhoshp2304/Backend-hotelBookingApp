const mongoose =require('mongoose');

const bookingSchema = mongoose.Schema({
    room : {
        type : String, require : true
    },
    roomId :{
        type:String,require :true
    },
    userId : {
        type : String, require : true
    },
    fromdate : {
        type : String, require : true
    },
    todate : {
        type : String, require : true
    },
    totalamount : {
        type : Number, require : true
    },
    totaldays : {
        type : Number, require : true
    },
    transactionId : {
        type : String, require : true
    },
    status : {
        type : String, require : true, default:'booked'
    }
},
{
    timestamps :true
});

const Booking = mongoose.model('bookings',bookingSchema);

module.exports =Booking;