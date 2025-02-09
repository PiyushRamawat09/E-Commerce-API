const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },

  email: {
    type: String,
    required: [true, "Please enter your mail"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid mail"],
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should have more than 8 characters"],
    select: false,
  },

  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// encrypting password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJWTtoken = function(){
    return jwt.sign({id : this._id}, process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    })
}

// compare password
userSchema.methods.comparePassWord = async function(enteredPassword){
   return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("user", userSchema);
