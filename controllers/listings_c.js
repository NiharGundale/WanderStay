const Listing=require("../models/Listing");
const ExpressError=require("../utils/ExpressError.js");

module.exports.index=async(req,res)=>{
    let all_listings=await Listing.find();
    res.render("listings/index.ejs",{all_listings});
}

module.exports.Render_new_form=(req,res)=>{
    // res.send("ok");
    // console.log(req.user);
    // if(!req.isAuthenticated()){
    //     req.flash('error','Please login');
    //     return res.redirect('/login');
    // }
    
    res.render("listings/new.ejs");
}

module.exports.create_listing=async(req,res,next)=>{
    
    // console.log(req.body);
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Bad Request Send valid data");

    // }
    // if(!req.body.listing.description){
    //     throw new ExpressError(400,"No descrition");
    // }
    // if(!req.body.listing.location){
    //     throw new ExpressError(400,"No Location");
    // }
    // if(!req.body.listing.country){
    //     throw new ExpressError(400,"No Country");
    // }
    
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,"...",filename);
    

    let newlisting=req.body.listing;
    // //adding Logged in user
    
    console.log(newlisting);
    let data=new Listing(newlisting);
    data.owner=req.user._id;
    
    data.image={url,filename}
    await data.save();

    //creating flash message after creating new listing
    req.flash('success','new listing created!')
    
    res.redirect("/listings");
   
}

module.exports.Show_listing=async (req,res)=>{
    let {id}=req.params;
    // console.log(id);
    // res.send(id);

    //Populating
    
    const listing=await Listing.findById(id).
    populate({path:"reviews",populate:{
        path:"author"
    }}).
    populate('owner');
    
    
    if(!listing){
        req.flash("error",'Listing does not exist!');
        res.redirect('/listings');
    }
    else{
         console.log(listing);
        res.render("listings/show.ejs",{listing});

    }

}

module.exports.render_edit_form=async(req,res)=>{
    // console.log(req.params);
    let {id}=req.params;
    let data=await Listing.findById(id);
    console.log(data);

    let originalImageUrl=data.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250/e_blur:300")
    res.render("listings/edit.ejs",{data,originalImageUrl});
}

module.exports.Update_listing=async(req,res)=>{

    // console.log(req.body);
    let {id}=req.params;
    // let {Title,description,Price,location,Country}=req.body;
    if(!req.body.listing){
        throw new ExpressError(400,"Bad Request Send valid data");

    }
    
    let list=req.body.listing;
    console.log(list);
    let List= await Listing.findByIdAndUpdate(id,list);
    
    if(typeof req.file!= 'undefined'){
        let url=req.file.path;
        let filename=req.file.filename;
        List.image={url,filename};
        await List.save();
    }

    req.flash('success','listing updated!')
    res.redirect(`/listings/${id}`);
    
}

module.exports.delete_listing=async(req,res)=>{
    // console.log(req.params);
    let {id}=req.params;
    let deleted_List=await Listing.findByIdAndDelete(id);
    // res.send("ok");
    console.log(deleted_List);
     req.flash('success','listing Deleted!')
    res.redirect("/listings");
}
module.exports.get_Farms=async(req,res)=>{
    let {id}=req.params;
    let {category}=req.params;
    let farms_lists=await Listing.find({category})
    console.log(farms_lists);
    res.render("filters/Filter.ejs",{farms_lists});
    // res.send('got');
}