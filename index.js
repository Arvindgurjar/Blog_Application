const express = require("express")
const mongoose = require("mongoose")
const app = express();
require("dotenv").config({path:"./config.env"})
mongoose.set("strictQuery",false)
const cors = require("cors")
const PORT = process.env.PORT 
require("./config/config")
app.use(cors());
app.use(express.json())
app.use("/blogapi",require("./Router/Router"))

app.listen(PORT,console.log(`listening at ${PORT}`))