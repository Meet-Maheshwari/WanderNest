const Listing = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log(newReview);
    req.flash("success", "Reviews added successfully!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req, res) => {
    let {id, reviewId} = req.params;
    console.log(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
}