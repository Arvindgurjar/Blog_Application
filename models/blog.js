const mongoose = require("mongoose")


const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
        trim:true,
        minLength:20,
    },
    picture:{
        type:String,
        require:true,
        trim:true
    },
    description:{
        type:String,
        require:true,
        trim:true,
        minLength:200,
    },
    date:{
        type:Date,
        default:Date.now
    },
    user_id:{
        type:String,
        require:true,
        trim:true
    }
})

module.exports = new mongoose.model("Blogs",blogSchema);