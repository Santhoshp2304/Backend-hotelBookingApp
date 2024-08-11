const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  location: {
    type: String,
    require: true,
  },
  phonenumber: {
    type: Number,
    require: true,
    unique: true,
  },
  maxcount: {
    type: Number,
    require: true,
  },
  rentperday: {
    type: Number,
    require: true,
  },
  images: [],
  currentbookings: [],
  description: {
    type: String,
    require: true,
  },
},{
    timestamps :true
});

const Room = mongoose.model("rooms", roomSchema);

module.exports = Room;
