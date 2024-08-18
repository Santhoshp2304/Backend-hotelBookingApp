const express = require("express");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51PnNBFP0UQ2xoJVb74IAoapQDeZ8NtfhIOAbe7CsQqLmtq12IMn4JZN6stVU5WCd1zZjgjpnZ61kwIDoWU1adwuQ00F3AHyOFU"
);
const { v4: uuidv4 } = require("uuid");

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
    token,
  } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "inr",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    if (payment) {
      const newBooking = new Booking({
        room,
        roomId,
        userId,
        fromdate: moment(fromdate).format("YYYY-MM-DD"),
        todate: moment(todate).format("YYYY-MM-DD"),
        totalamount,
        totaldays,
        transactionId: "1234",
      });

      const booking = await newBooking.save();
      const tempRoom = await Room.findOne({ _id: roomId });
      tempRoom.currentbookings.push({
        bookingId: booking._id,
        fromdate: moment(fromdate).format("YYYY-MM-DD"),
        todate: moment(todate).format("YYYY-MM-DD"),
        userId,
        status: booking.status,
      });
      await tempRoom.save();
      res.json("Payment successfully, Your room booked!");
    }
  } catch (error) {
    res.json("payment Failed");
  }
});

router.get("/getBookings/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userBookings = await Booking.find({ userId });
    res.json(userBookings);
  } catch (error) {
    res.json(error);
  }
});

router.get("/getAllBookings", async (req, res) => {
  try {
    const allBookings = await Booking.find({});
    res.json(allBookings);
  } catch (error) {
    res.json(error);
  }
});

router.post("/cancelBooking", async (req, res) => {
  const { bookingId, roomId } = req.body;
  try {
    const selectedBooking = await Booking.findOne({ _id: bookingId });
    selectedBooking.status = "cancelled";
  //  console.log("selectedBooking : ",selectedBooking)

    await selectedBooking.save()
    const room = await Room.findById({ _id: roomId });
    const temp = room.currentbookings.filter(
      (booking) => booking.bookingId.toString() != bookingId
    );
    room.currentbookings = temp;
    await room.save();
    res.json("Booking cancelled succesfully");
  } catch (error) {
    res.json(error.message);
  }
});
module.exports = router;
