const express=require("express");
const router=express.Router();
const User=require("../models/User.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl} = require("../Middleware.js");

const user_controller=require("../controllers/users_c.js")


router.route("/signUp")
    .get(wrapAsync( user_controller.render_signUP_form))
    .post(wrapAsync(user_controller.Sign_Up_user))


router.route("/login")
    .get(wrapAsync(user_controller.render_login_form))
    .post(saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    }),
    wrapAsync(user_controller.authenticate_user)
)
//signUP newUser
// router.get("/signUp",wrapAsync( user_controller.render_signUP_form));

// router.post("/signUp",wrapAsync(user_controller.Sign_Up_user))



//Login User
// router.get("/login",wrapAsync(user_controller.render_login_form))

// router.post("/login",saveRedirectUrl,
//     passport.authenticate("local",{
//         failureRedirect:"/login",
//         failureFlash:true,
//     }),
//     wrapAsync(user_controller.authenticate_user)
// )

//logout Route
router.get('/logout',wrapAsync(user_controller.logout_user))

module.exports=router;