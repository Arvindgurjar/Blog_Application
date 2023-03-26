const mongoose = require("mongoose")

const DB = process.env.DATABASE

mongoose.connect(DB)
.then(()=>console.log("mongo connected successfully"))
.catch((err)=>console.log(err))