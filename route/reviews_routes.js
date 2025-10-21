const express=require("express");
const Review=require("../models/Review.js");
const Listing=require("../models/Listing.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewschema}=require("../Schema.js");

const wrapAsync=require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewOwner, validateReview } = require("../Middleware.js");

const router=express.Router({mergeParams:true});

const Review_controller=require("../controllers/reviews_c.js");




//REVIEWS
//Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(Review_controller.create_review))

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(Review_controller.delete_review))

module.exports=router;