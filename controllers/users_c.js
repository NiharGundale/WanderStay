const User=require("../models/User.js");

module.exports.render_signUP_form= async(req,res)=>{
    // res.send("form_nigga");
    res.render("users/signUp.ejs");
}

module.exports.Sign_Up_user=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});

        const registered_user=await User.register(newUser,password);
        console.log(registered_user);

        //Login After SignUp
        req.login(registered_user,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success",`Welcome to Wanderstay ${username} !`);
            res.redirect("/listings");
        })
        

    }
    catch(e){
        req.flash('error',e.message);
        res.redirect("/signUp");
    }
    
}

module.exports.render_login_form=async(req,res)=>{
    res.render("users/login_user.ejs");
}

module.exports.authenticate_user=async(req,res)=>{
        let {username}=req.body;
        req.flash('success',`welcome Back on Wanderstay ${username} !`);
        // res.redirect('/listings');
        let redirectUrl=res.locals.redirectUrl||"/listings";
        res.redirect(redirectUrl);
}

module.exports.logout_user=async(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
             next(err);
        }
        req.flash('success','logged You out!');
        res.redirect("/listings");
    })
}