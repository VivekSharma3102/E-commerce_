const mongoose = require('mongoose');
const validator = require('validator')
const  bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter your Name "],
        maxLength :[30,"Name cannot exceed 30 characters "],
        minLength :[3,"Name should have more than 3 characters "]
    },
    email:{
        type:String,
        required:[true,"Please Enter your Email "],
        unique : true,
        validate : [validator.isEmail,"Please enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter your Name "],
        minLength :[8,"Password should be greater than 8 characters "],
        select :false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }   
    },
    role:{
        type:String,
        default:"user"
    },

    resetPasswordToken :String,

    resetPasswordDate :Date,


});

userSchema.pre("save",async function(next){
    if (!this.isModified("password")){
        next()
    }
    var salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password,salt);
}
)

// JWT Token --

userSchema.methods.get_JWT_Token = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

// Compare Password 

userSchema.methods.compare_Password = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)

}

// generating reset password token 
userSchema.methods.get_ResetPassword_Token = function(){
    // generating token
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    // 
    this.resetPasswordToken =crypto.createHash("sha256").update(resetToken).digest('hex');
    this.resetPasswordDate = Date.now() + 15 * 60 * 1000
    
    return resetToken;

}

module.exports =mongoose.model("Users",userSchema)