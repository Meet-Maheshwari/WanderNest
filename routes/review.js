const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");

//Reviews
//POST Review 
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.createReview));
 
//DELETE REVIEW
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewControllers.destroyReview));

module.exports = router;
