const nodemailer = require("nodemailer")
exports.sendmail = async (sub,message,email) => {
    //console.log(sub+"  "+message)
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL, // generated ethereal user
                pass: process.env.PASSWORD, // generated ethereal password
            },
        });
    
    
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: sub,
            text: "WELCOME OTP",
            html: message,
        });
    } catch (error) {
        res.status(500).send(error)
    }


}