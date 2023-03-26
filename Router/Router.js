const express = require("express")
const router = express.Router();
const blogmodel = require("../models/blog")
const usermodel = require("../models/user")
const bcrypt = require("bcrypt")
const { sendmail } = require("../services/sendmail")
const { protect } = require("../middleware/auth")
const { upload } = require("../services/uploadimage")
router.post("/postblog", protect, upload.single("picture"), async (req, res) => {
    const { title, description } = req.body
    const user_id = req.user._id;
    const picture = req.file.filename
    //console.log(picture)
    try {
        if (!title || !picture || !description || !user_id) {
            res.status(400).send("missing Data")
        }
        const newBlog = new blogmodel({
            title, picture, description, user_id
        })
        await newBlog.save();
        res.status(201).send("Successfully Posted");
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/sendotp", async (req, res) => {
    const { email, mobile } = req.body
    try {
        const user = await usermodel.findOne({ $or: [{ email }, { mobile }] })
        if (user) {
            res.status(400).send("Already exist");
        }
        const otp = Math.floor(Math.random() * ((999999 - 100000) + 1) + 100000);
        const sub = "[Blog] Please verify your device"
        const message = `<p>Hey!</p><br>

        <p>A sign up attempt requires further verification because we did not recognize your device. To complete the sign up, enter the verification code on the unrecognized device.</p><br>
        
        <p>Verification code: ${otp} </p>
        
        <p>Thanks</p>
        <p>Team Blog</p>`
        //console.log("Sdfg")
        sendmail(sub, message, email);
        res.status(201).send(otp.toString())
    } catch (error) {
        res.status(500).send(error)
    }
})


router.post("/sendlink", async (req, res) => {
    const email = req.body.email

    try {
        const user = await usermodel.findOne({ email });
        if (!user) {
            res.status(400).send("User NOt Found");
        } else {
            const sub = "Reset Password For Blog Application"
            const massage = `<p>Hey ${user.fname}  ${user.lname}! </p><br>

                <p>Your Reset Password Link :- http://localhost:3000/forgetpassword/${user._id}</p><br>

                <div>Thanks</div>
                <p>Team Blog</p>`
            sendmail(sub, massage, email);
            res.status(200).send("Link Send Successfully");
        }

    } catch (error) {
        res.status(500).send(error);
    }
})


router.post("/userregister", async (req, res) => {
    //console.log(req.body)
    const { fname, lname, email, mobile, password } = req.body

    try {
        if (!fname || !lname || !email || !mobile || !password) {
            res.status(400).send("Missing Details")
        }
        const user = await usermodel.findOne({ $or: [{ email }, { mobile }] })
        if (user) {
            res.status(404).send("Already exist");
        }
        const newuser = new usermodel({
            fname, lname, email, mobile, password
        })
        newuser.password = await bcrypt.hash(newuser.password, 12);
        await newuser.save();
        res.status(201).send("register Successfull");

    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch("/forgetpass/:id", async (req, res) => {
    const _id = req.params.id
    //console.log(_id)
    try {
        newpass = await bcrypt.hash(req.body.password, 12)
        await usermodel.findByIdAndUpdate({ _id }, { password: newpass })
        res.status(201).send("Password Updated Successfully")
    } catch (error) {
        res.status(500).send(error)
    }
})


router.post("/userlogin", async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await usermodel.findOne({ email }).select("+password");
        if (!user) {
            res.status(400).send("Not Found")
        }
        // console.log(user)
        const pass = await bcrypt.compare(password, user.password)
        //console.log(pass)

        
        if (pass) {
            const token = await user.getgeneratetoken();
            //console.log(token)
            res.cookie("token",token,{
                expires:"",
                httpOnly: true,
            })
            res.status(200).send(JSON.stringify(user._id))
        } else {
            res.status(404).send("Bad request")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get("/listblog", async (req, res) => {
        try {
            const blogdata = await blogmodel.find();
            res.status(200).send(blogdata);
            //console.log(blogdata)          
        } catch (error) {
            res.status(500).send(error)
        }
})

router.get("/logout",protect,async(req, res) => {
    //console.log("kkk")
    const t = req.user.tokens.filter((val)=>val.token !== req.headers.authorization)
    req.res.clearCookie("token");
    res.status(200).send("Logout Successfully");

})


module.exports = router;