const jwt = require("jsonwebtoken")
const usermodel = require("../models/user")

exports.protect = async(req,res,next)=>{

    let token
    req.headers.authorization =req.headers?.cookie.split("=")[1]; 
    // console.log(req.headers.authorization)
    if(req.headers.authorization)
    {
        token = req.headers.authorization
        //console.log(token)
    }
    try {
        const decode = jwt.verify(token,process.env.SECRET_KEY)
        //console.log(decode._id)
        const usr = await usermodel.findOne({_id:decode._id});
        //console.log(usr);
        req.user = usr
        next();
    } catch (error) {
        res.status(500).send("unautharized");
    }
}