const Listing = require("./models/Listing");
const Review = require("./models/Review");
const {listingSchema,reviewschema}=require("./Schema.js");

const isLoggedIn=async(req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);
    console.log(req.user);
    
    if(!req.isAuthenticated()){
        //Redirect Url
        req.session.redirectUrl=req.originalUrl;
        console.log(req.path,"..",req.originalUrl);
        req.flash('error','Please login');
        return res.redirect('/login');
    }
    next();
    

}
const saveRedirectUrl=async(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


const isOwner=async(req,res,next)=>{

    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!(listing.owner._id.equals(res.locals.currUser._id))){
        req.flash("error","You Are Not The Owner Of Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const isReviewOwner=async(req,res,next)=>{
     let {id,reviewId}=req.params;
     let review=await Review.findById(reviewId);
     if(!(review.author.equals(res.locals.currUser._id))){
        req.flash("error","You Are Not The Owner Of Review");
        return res.redirect(`/listings/${id}`);

     }
     next();

}

// Validate listing using joi for middleware as post request
const validateListing =(req,res,next)=>{
    // let result= listingSchema.validate(req.body);
    let {error}=listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }

} 


const validateReview =(req,res,next)=>{

    let {error}=reviewschema.validate(req.body);
    // console.log(result);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }

} 
module.exports={isLoggedIn,saveRedirectUrl,isOwner,isReviewOwner,validateListing,validateReview};
