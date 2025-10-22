if(process.env.NODE_ENV !='production'){
    require('dotenv').config();
    // console.log(process.env.secret);
}


const express=require("express");
const mongoose=require("mongoose");
// const Listing=require("./models/Listing.js");
const path=require("path");
const methodOverride = require('method-override');
const esjMate=require('ejs-mate');
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema,reviewschema}=require("./Schema.js");
// const Review=require("./models/Review.js");
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require("./models/User.js");

const listings_routes=require("./route/listings_routes.js");
const review_routes=require("./route/reviews_routes.js");
const user_routes=require("./route/user_routes.js");

const app=express();
app.set("view engine","ejs");
app.engine("ejs",esjMate);
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));


const dburl=process.env.ATLASDB_URl;

const m_store= MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

m_store.on('error',()=>{
    console.log("ERROR in Mongo Session Store");
})
const sessionOptions={
    store:m_store,
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+5*24*60*60*1000, // expires in 5 days
        maxAge:5*24*60*60*1000,             // cookie lifetime 5 days
        httpOnly:true

    }
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //Initilizing passport for every request
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    console.log(res.locals.success);
    console.log(res.locals.error);
    console.log(res.locals.currUser);

    next();
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("server ready");
});



async function main() {
  await mongoose.connect(dburl,{
    
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: false,

  });

  
}
main().then(res=>{console.log("DB OK")}).catch(err => console.log(err));

// app.get("/",(req,res)=>{
//     res.send("WELCOME TO WANDERLUST");
//     // res.redirect("/listings");
// });

//Listigs route
app.use("/listings",listings_routes);



// //REVIEWS Routs
app.use("/listings/:id/reviews",review_routes);

//user Routes
app.use("/",user_routes);



// app.get('/demouser',async(req,res)=>{
//     let fakeUser=new User({
//         email:"studentemail.com",
//         username:"Nigga_delta"
//     });
//     let newUser=await User.register(fakeUser,'Hello_niha');
//     res.send(newUser);
// })




app.all(/.*/,(req,res,next)=>{
    
    throw new ExpressError(404,"page not found!");
    // next(new ExpressError(404,"page not found"));
})
// Error handelling
app.use((err,req,res,next)=>{
    let {status=500,message="Some Thing went erong"}=err;
    res.status(status).render("Error.ejs",{err});
    // res.status(status).send(message);
})
