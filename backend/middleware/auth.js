const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler("Please login first to access this resource", 401)
    );
  }

  const decodedData = jwt.verify(token,process.env.JWT_SECRET);

  console.log('decodedData', decodedData)

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
           return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this route`, 403))
        }
        next()
    }
}
