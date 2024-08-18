const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    roomId: {
      type: String,
      require: true,
    },
    review: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = new mongoose.model("reviews", reviewSchema);

module.exports = Review;
