const sendToken = (user,statusCode,res)=>{
    //  calling jwt token here  which we created in usermodel
    const token = user.get_JWT_Token();

    // options for cookie --
    const options ={
        expires : new Date (
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 ),
            httpOnly: true , 
    };

    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        token,
    })

};

module.exports = sendToken ;