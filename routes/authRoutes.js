const express = require("express");
const router = express.Router();
const {register, login} = require("../controllers/authControllers");
const {body} = require("express-validator");


// Validation rules for registration and login
const registerValidation = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({min : 6}).withMessage("Password must be at least 6 characters long"),
];


// Validation rules for login
const loginValidation = [
       body("email").trim().isEmail().withMessage("Please provide a valid email"),
       body("password").notEmpty().withMessage("Password is required"),
];

// Registration and login routes
router.post("/register",registerValidation,register);
router.post("/login",loginValidation,login);

module.exports = router;