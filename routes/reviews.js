const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/Review.js");
const { isLoggedIn , isReviewAuthor , validateReview} = require("../middleware.js");

// Post Route
router.post("/", isLoggedIn , validateReview , wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");

    res.redirect(`/listings/${req.params.id}`);

}))
 
// Distrroy Route
router.delete("/:reviewId", isLoggedIn  , isReviewAuthor ,  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    console.log(id);
    console.log(reviewId);

    let res1 = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let res2 = await Review.findByIdAndDelete(reviewId);

    console.log(res1);
    console.log(res2);

    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;