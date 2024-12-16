const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});


userSchema.plugin(passportLocalMongoose); // this needs to be used before model creation

const User = mongoose.model("User", userSchema); 

module.exports = User;