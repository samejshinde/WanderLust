const mongoose = require('mongoose');
const { Schema } = require("mongoose");
const Review = require("./Review.js");


const listingSchema = mongoose.Schema({
    title : {
        type : String
    },
    descryption : {
        type : String 
    },
    image: {
        type : String,
        default : "https://plus.unsplash.com/premium_vector-1724595301240-4735a1642bd1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D",
        set : (v) => v === "" ? "https://plus.unsplash.com/premium_vector-1724595301240-4735a1642bd1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D" : v
    },
    price : {
        type : Number
    },
    location : {
        type : String
    },
    country : {
        type : String
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref : "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}) ;

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;

