const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const { populate } = require("../models/User.js");




// index Route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// My Route
router.get("/my", isLoggedIn , wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/my.ejs", { allListings });
}));

// new
router.get("/new", isLoggedIn , (req, res) => {
    res.render("listings/new.ejs"); 
})

// show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    console.log(listing);
    if (!listing) {
        req.flash("error", "Listing You Requested for Does Not Exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

// create Route
router.post("/",isLoggedIn , validateListing , wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

// edit Route
router.get("/:id/edit" , isLoggedIn , isOwner , wrapAsync( async (req , res) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing You Requested for Does Not Exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
}))

// Update Route
router.put("/:id", isLoggedIn , isOwner , validateListing ,wrapAsync( async (req , res) =>{
    let { id } = req.params;
        if (!req.body.listing) {
        throw new ExpressError(400, "Pleasw send valid data");
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}))

// Delete Route
router.delete("/:id", isLoggedIn , isOwner , wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));




module.exports = router;