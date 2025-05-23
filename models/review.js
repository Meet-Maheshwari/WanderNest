const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = reviewSchema;
module.exports = Review;
