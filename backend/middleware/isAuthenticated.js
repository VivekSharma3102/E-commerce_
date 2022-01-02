const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');



const isAuthenticatedUser = catchAsyncError( async (req,res,next)=>{


    const cookie = req.cookies;
    const token = cookie.token 
    // gives us token which is stored in cookies--

    // checking if not token
     if (!token){
         return next( new ErrorHandler("Please Login to access this resource ",401))
     }

    // decode our token and gives us id 
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await userModel.findById(decodedData.id)

    next();
} )

module.exports = isAuthenticatedUser ;