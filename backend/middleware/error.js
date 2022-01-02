const ErrorHandler = require("../utils/errorHandler")

const Error = (error,req,res,next)=>{

    error.statusCode= error.statusCode || 500
    error.message = error.message || "internal server error"


// wrong mongodb error 
    if(error.name === "CastError"){
        const message = `resource not found . Invalid : ${error.path}` ;
        error= new ErrorHandler(message,404);
    }



    res.status(error.statusCode).json({
        success : false,
        error:{
            status : error.statusCode ,
            message : error.message
        }
        // error.stack
        
    })
}

module.exports= Error