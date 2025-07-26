const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const authMiddleware = async (req,res,next) => {

    const token = req.header('Authorization')
    console.log("Token : ",token);

    if(!token){console
        return res
                .status(401)
                .json({message : "Unauthorized HTTP, Token not provided"})
    }

    const jwtToken = token.replace("Bearer","").trim()

    try{
        const isVarified = jwt.verify(jwtToken,process.env.JWT_SECRET_KEY)//decode

        const userData = await User.findOne({email: isVarified.email}).select({password:0})

        if(userData.isAdmin === "true"){

        }

        // custom properties
        req.user = userData
        req.token = token
        req.userID = userData._id

        next()
    }catch{
        res.status(401).json({message:"Unauthorized. Invalid token."})
    }

}

module.exports = authMiddleware