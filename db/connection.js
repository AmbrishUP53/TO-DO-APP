const mongoose = require("mongoose");

const Mongo_URL = "mongodb+srv://ambrish121495:AmbMongoDB@cluster0.iu1ow4q.mongodb.net/ToDOs?retryWrites=true&w=majority&appName=Cluster0"
const connectToDB = async function (){
    try{
        await mongoose.connect(Mongo_URL);
        console.log("connection successful!!")
    }catch(err){
        console.log("error from database !!" + err);
    }
}

module.exports = connectToDB ;