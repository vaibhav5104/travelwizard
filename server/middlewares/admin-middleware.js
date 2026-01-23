const adminMiddleware = async (req,res,next) => {//we use next in middlewares

    try {
        // console.log(req.user);
        const adminRole = req.user
        if(!adminRole) {
            console.log(req.user);
            return res
            .status(403)
            .json({message : "Access denied. User is not an admin"})
        }
        // res.status(200).json({msg:req.user.isAdmin})
        next()
    } catch (error) {
        next(error)
    }

}

module.exports = adminMiddleware