
// const { required } = require("joi");
const mongoose=require("mongoose");
const passportLocalMongoose=require('passport-local-mongoose');

const User=new  mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
});


User.plugin(passportLocalMongoose);


const user=mongoose.model('User',User);
module.exports=user;