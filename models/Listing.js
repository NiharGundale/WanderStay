const mongoose=require("mongoose");
const { listingSchema } = require("../Schema");
const Review=require("./Review.js");
const { required } = require("joi");

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

//   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }
// main().then(res=>{console.log("DB OK")}).catch(err => console.log(err));

const ListSchema=new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    description: String,
    image: {
        url:String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    category:{
        type:String,
        enum:['mountains','rooms','farms','iconic','pool','arctic'],
        required:true,
    },

})
//Middleware After 
// 



// deleting listing middleware
ListSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: { $in:listing.reviews }})

    }
    
})
const Listing=mongoose.model("Listing",ListSchema);
module.exports=Listing;