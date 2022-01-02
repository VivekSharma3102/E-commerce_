const catchAsyncError = require('../middleware/catchAsyncError');
const userModel = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken') ;
const sendEmail = require("../utils/sendEmail");

// backend code to create user --
exports.register_User =catchAsyncError(async(req,res,next)=>{

    const user =await userModel.create({
        name:req.body.name,
        email: req.body.email,
        password:req.body.password,
        avatar:{
            public_id:"this is the sample id",
            url:"profilepicurl"
        },
        role:req.body.role,
    });

    // ----
    sendToken(user,201,res);

})


// backend code to login user --
exports.login_User =catchAsyncError(async(req,res,next)=>{

    const {email,password} = req.body ;
    
    // checking if user email and password exists or not

    if (!email || !password){
        return next(new ErrorHandler("Please Enter Email and Password",400))
    }

    // finding email from database
    const user = await userModel.findOne({email}).select("+password");
    // if email not found then return error
    if (!user){
        return next(new ErrorHandler("Invalid Email and Password",400));

    }
    // if email found then findpassword
    const Password_Match = await user.compare_Password(password);
    // if not password then return error
    if (!Password_Match){

        return next(new ErrorHandler("Invalid Email and Password",400))
    }
    // if credentials are correct then send auth token

    const token = user.get_JWT_Token();
    
    sendToken(user,200,res);   
    
})

// log out user  

exports.logOut_User = catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires : new Date (
        Date.now()),
        httpOnly: true
    }
    )

    res.status(200).json({
        success : true,
        message : "Logged Out Successfully"
    }
    );
        
});

// giving some permission only according to user role 
exports.authorizeRole = (...roles)=>{
    return (req,res,next)=>{
        // checking if our user role exists in roles array or not  --
        if (!roles.includes(req.user.role)){
            return next( new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource `,401))
        }

        next();

    };
}

// functionn  for reset password 
exports.reset_password = catchAsyncError(async(req,res,next)=>{
     
    // finding email from database
    const user = await userModel.findOne({email:req.body.email});

    // if email not found then return error
    if (!user){
        return next(new ErrorHandler("Email not Found",404));

    }
    // get reset password token
    const resetToken= user.get_ResetPassword_Token();
    await user.save({ validateBeforeSave : false})
    
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your Password reset link is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this Email then , Please ignore it. `
    
    try {

        await sendEmail({
            email : user.email ,
            subject : " Website Password Recovery",
            message :message 

        })

        res.status(200).json({
            success : true ,
            message : `email sent to ${user.email} Successfully`
        });
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordDate = undefined;
        await user.save({ validateBeforeSave : false})

        return next( new ErrorHandler(error.message , 500))
        
    }


});