const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        require: true,
        trim: true,
        minLength: 3,
        maxLength: 20,
        validate(value) {
            if (!(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/).test(value)) {
                throw new error("Invalid UserName");
            }
        }

    },
    lname: {
        type: String,
        require: true,
        trim: true,
        minLength: 3,
        maxLength: 20,
        validate(value) {
            if (!(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/).test(value)) {
                throw new error("Invalid UserName");
            }
        }
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value))) {
                throw new error("Invalid Email Address")
            }
        }
    },
    mobile: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        minLength: 10,
        maxLength: 10,
        validate(value) {
            if (!(/^[0-9]{10}$/).test(value)) {
                throw new error("Invalid UserName");
            }
        }

    },
    password: {
        type: String,
        require: true,
        trim: true,
        select: false,
        validate(value) {
            if (!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).test(value)) {
                throw new error("Password Is Not Strong")
            }
        }

    },
    date: {
        type: Date,
        default: Date.now
    },
    tokens: [{
        token: {
            type: String,
        }


    }]
})


userSchema.methods.getgeneratetoken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY,{expiresIn:"1h"})
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token;
}
module.exports = new mongoose.model("users", userSchema);