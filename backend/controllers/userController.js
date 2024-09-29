const User = require('../Models/userModel');
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require('../utils/jwtToken');

//Register User 

exports.registerUser = catchAsyncErrors(async (req,res,next) => {
    const {name, email, password} = req.body;

    const user = await User.create({
        name, email, password,
        avatar : {
            public_id : "this is my dummy public Id",
            url : "ProfileUrl"
        }
    })

    sendToken(user, 201, res);

})

// login user 

exports.loginUser = catchAsyncErrors(async (req,res,next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter email or passowrd", 400))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassWord(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    sendToken(user, 200, res);
})

// log out user

exports.logOut = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires : new Date(Date.now()),
        httpOnly : true,
    })

    res.status(200).json({
        success : true,
        message : "Logged out successfully"
    })
})