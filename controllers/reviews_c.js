const Review=require("../models/Review.js");
const Listing=require("../models/Listing.js");


module.exports.create_review=async(req,res)=>{

    console.log(req.params.id);
   let listing=await Listing.findById(req.params.id);
   let new_review=new Review((req.body.review));

   new_review.author=req.user._id;
   console.log(new_review);


   listing.reviews.push(new_review);
   await new_review.save();
   await listing.save();
    req.flash('success','new Review created!')
   res.redirect(`/listings/${req.params.id}`);
}

module.exports.delete_review= async(req,res)=>{
    let {id,reviewId}=req.params;
    // console.log(id,reviewId);
    
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     req.flash('success','Review Deleted!')
    res.redirect(`/listings/${id}`);
}