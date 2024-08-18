const express = require("express");
const Review = require("../models/Review");
const router = express.Router();

router.post("/postReview", async (req, res) => {
   const {username,roomId,review,rating} =req.body
  try {
    const newReview = new Review({username,roomId,review,rating});
    await newReview.save();
    res.json("Review added successfully");
  } catch (error) {
    res.json("Adding review failed");
  }
});

router.get("/getReviews", async (req, res) => {
  
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
