const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");


const generateToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN,
    });
};

//registering a new user
const register = async(req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success : false,
                errors : errors.array(),
            });
        }
       const { name, email, password, adminCode } = req.body;

       const existingUser = await User.findOne({ email });
          if (existingUser) {
          return res.status(400).json({
             success: false,
             message : "Registration unsuccessful. Try logging in or use a different email."
      });
      }

       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);

       let role = "viewer";

       if (adminCode && adminCode === process.env.ADMIN_SECRET_KEY) {
           role = "admin";
}

     const user = await User.create({
         name,
         email,
         password: hashedPassword,
         role,
});

        const token = generateToken(user._id);

        res.status(201).json({
            success :true,
            message : "Account created successfully.",
            token,
            user:{
                id : user._id,
                name : user.name,
                email : user.email,
                role : user.role,
                status : user.status,
            },
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Something went wrong. Please try again.",
        });
        }
    };



//login existing user
    const login = async(req,res) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    success : false,
                    errors : errors.array(),
                });
            }

            const {email,password} = req.body;

            const user = await User.findOne({email}).select("+password");

            if(!user || !(await bcrypt.compare(password, user.password))){
                return res.status(401).json({
                    success : false,
                    message : "Authentication failed." 

                });
            }

            if(user.status === "inactive"){
                return res.status(401).json({
                    success : false,
                    message : "Authentication failed."
                });
            }
// Generate JWT token

            const token = generateToken(user._id);

            res.status(200).json({
                success : true,
                message : "Login successful.",
                token,
                user : {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    role : user.role,
                    status : user.status,
                },
            });

        }
            catch (error) {
                res.status(500).json({
                    success : false,
                    message : "Something went wrong. Please try again.",
                });
            }
    };

    module.exports = {register , login};
