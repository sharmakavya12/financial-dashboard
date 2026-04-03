const jwt = require("jsonwebtoken");
const User = require("../models/User");


// Middleware to protect routes and restrict access based on user roles
const protect = async(req,res,next) =>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message : "Access denied",
            });
    }
    // Extract token from header
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    // Find user by ID and exclude password
    const user = await User.findById(decoded.id).select("-password");


// Check if user exists and is active
    if (!user) {
      console.log(`Auth failed: user not found for token id ${decoded.id}`);
      return res.status(401).json({ success: false, message: "Authentication failed." });
}


// Check if user is inactive
       if (user.status === "inactive") {
         console.log(`Auth failed: inactive user ${user.email} attempted access`);
      return res.status(401).json({ success: false, message: "Authentication failed." });
}
req.user = user;
next();

} catch(error){
    return res.status(401).json({
        success : false,
        message : "Authentication failed",
    });
}
};

// Middleware to restrict access based on user roles
const restrictTo =(...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success : false,
                message : "Forbidden: You do not have permission to perform this action",
            });
        }
        next();
    
}
};
module.exports = { protect , restrictTo };