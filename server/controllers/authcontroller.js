const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { CustomError } = require("../middlewares/errors");


const SignUpController = async(req,res,next) => {
    try {
        const {password,email,username}=req.body;
        const existinguser = await User.findOne({$or: [{username},{email}]});
        if (existinguser) {
            throw new CustomError("user or email already exist",400)
        }
        const salt = await bcrypt.genSalt(10);
        const heashedpassword = await bcrypt.hash(password,salt);
        const newUser = new User({...req.body,password:heashedpassword});
        const saveduser = await newUser.save();
        res.status(201).json(saveduser);
    } catch (error) {
       res.status(500).json(error)
    }
}


const SignInController = async(req,res,next) => {
    try {
        let user;
        if(req.body.email){
            user = await User.findOne({email:req.body.email});
        }else{
            user = await User.findOne({username:req.body.username});
        }
        if(!user) throw new CustomError("user not found",404)
        const match = await bcrypt.compare(req.body.password,user.password)
        if(!match) throw new CustomError("wrong credentials",401);
        const accessToken = jwt.sign(
            {_id : user._id},
            process.env.ACCESS_TOKEN_PRIVATEKEY,
            {expiresIn:process.env.JWT_EXPIRE}
        )
        const refreshToken = jwt.sign(
            {_id : user._id},
            process.env.REFRESH_TOKEN_PRIVATEKEY,
            {expiresIn:process.env.JWT_REFRESH_EXPIRE}
        )
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"strict"
        })
        res.status(201).json({accessToken,refreshToken})
    } catch (error) {
        next(error)
    }
}


const LogoutController = async(req,res,next) => {
    try {
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).json("user log out successfully");
    } catch (error) {
        next(error);
    }
}

const meController = async(req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({message:"token not provided"})
    
    jwt.verify(token,process.env.JWT_EXPIRE , {} , async(err,data)=>{
        if(err) return res.status(403).json({message:"invalid or expired token"});
        
        try {
            const id = data._id;
            const user = await User.findOne({_id:id}).select("-password");
            if(!user) return res.status(404).json({message:"user not found"});
            res.status(201).json(user)
     
        } catch (error) {
            next(error)
        }
    })
}

const refreshController = async(req,res,next) => {
    try {
        const refreshToken = req.cookie.refreshToken;
        if(!refreshToken) throw new CustomError("refreshToken is not provided" , 401 );
        const data = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_PRIVATEKEY);
        const newAccessToken = jwt.sign({_id:data._id},process.env.JWT_SECRET, {expiresIn:"15m"});
        res.status(200).json({accessToken:newAccessToken})
    } catch (error) {
        next(error);
    }
}


module.exports = {
    SignUpController,
    SignInController,
    LogoutController,
    meController,
    refreshController
}