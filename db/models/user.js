const mongoose = require("mongoose");
const { required, minLength, maxLength, lowercase } = require("zod/v4-mini");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minLength : 3,
        maxLength :50,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
    } ,
    password : {
        type : String,
        required : true,
    },
    token : {
        type : String,

    }
})

const user= new mongoose.model("user" , userSchema);

module.exports = user