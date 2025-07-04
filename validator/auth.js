const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET ;

const auth = async function (req ,res , next){
    const token = req.headers.token;
    const verifiedData = jwt.verify(token , JWT_SECRET);

    if(verifiedData.email){
        next(); 
    }else{
        console.log("token invalid")
    }
    
}

module.exports = auth;