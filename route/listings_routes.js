const express=require("express");
const Listing=require("../models/Listing.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewschema}=require("../Schema.js");

const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, validateListing}=require("../Middleware.js");
const {isOwner}=require("../Middleware.js");

const lsitingcontroller=require("../controllers/listings_c.js");

const router=express.Router();
const multer  = require('multer')
const {storage}=require("../cloudeConfig.js");
const upload = multer({storage});


router.route("/")
    .get(wrapAsync (lsitingcontroller.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(lsitingcontroller.create_listing));
    



        //Farms Route
router.get("/categories/:category",wrapAsync(lsitingcontroller.get_Farms))
//INDEX ROUTE
// router.get("/",wrapAsync (lsitingcontroller.index));

//NEW ROUTE
router.get("/new",isLoggedIn,lsitingcontroller.Render_new_form);

//create route
// router.post("/",isLoggedIn,validateListing,wrapAsync(lsitingcontroller.create_listing));



router.route("/:id")
    .get(wrapAsync(lsitingcontroller.Show_listing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(lsitingcontroller.Update_listing))
    .delete(isLoggedIn,isOwner,wrapAsync(lsitingcontroller.delete_listing))


//show route
// router.get("/:id",wrapAsync(lsitingcontroller.Show_listing));

// EDIT route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(lsitingcontroller.render_edit_form));




// UPDATE route
// router.put("/:id",isLoggedIn,isOwner,wrapAsync(lsitingcontroller.Update_listing))

// delete route
// router.delete("/:id",isLoggedIn,isOwner,
//     wrapAsync(lsitingcontroller.delete_listing))


module.exports=router;