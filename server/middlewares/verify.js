const jwt = require("jsonwebtoken");
const { CustomError } = require("./errors");

const verifyToken = async(req,res,next)=> {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if(!token) throw new CustomError("you are not authenticated",401);

        const data = jwt.verify(token,process.env.ACCESS_TOKEN_PRIVATEKEY);
        req.userId = data._id;
        next();
    } catch (error) {
       if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            next(new CustomError("Token is not valid",403));
       }else{
        next(error)
       }
    }
}

module.exports = verifyToken;