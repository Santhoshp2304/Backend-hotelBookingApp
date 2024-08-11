const express = require("express");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const moment = require("moment");

const router = express.Router();

router.post("/book", async (req, res) => {
  const {
    room,
    roomId,
    userId,
    fromdate,
    todate,
    totalamount,
    totaldays,
  } = req.body;
  try {
    const newBooking = new Booking({
      room,
      roomId,
      userId,
      fromdate : moment(fromdate).format("YYYY-MM-DD"),
      todate : moment(todate).format("YYYY-MM-DD"),
      totalamount,
      totaldays,
      transactionId: "1234",
    });
    
    const booking = await newBooking.save();
    const tempRoom = await Room.findOne({ _id: roomId });
    tempRoom.currentbookings.push({
      bookingId: booking._id,
      fromdate : moment(fromdate).format("YYYY-MM-DD"),
      todate : moment(fromdate).format("YYYY-MM-DD"),
      userId,
      status :booking.status
    });
     await tempRoom.save();
    res.json("Booked Successfully");
  } catch (error) {
    res.json("Booking Failed");
  }
});
module.exports = router;
