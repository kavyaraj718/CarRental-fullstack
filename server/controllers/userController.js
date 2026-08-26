import User from "../models/User.js"; // we will import what a user is
import bcrypt from 'bcrypt'; // It helps to Hash the password
import jwt from 'jsonwebtoken'; // Token based authentication system
import Car from "../models/Car.js"; // What a Car is

// Generate JWT token 
const generateToken = (userId) => {
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET); // jwt.sign creates a token
}

// Register User 
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password || password.length < 8) { // if incorrect credentials gives error
            return res.json({success: false, message: 'Please provide all fields'});
        }

        const userExists = await User.findOne({email}); // if already user exists then error
        if(userExists) {
            return res.json({success: false, message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Stores the hashed password in hashedPassword
        const user = await User.create({name, email, password: hashedPassword}); // Created a user with a hashed password 
        const token = generateToken(user._id.toString());// stores the generated token
        res.json({success: true, token}); //if successful creation
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Login User
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body; // Whatever we write on the webpage comes in the form of post and is stored on req.body

        const user = await User.findOne({email}); 
        if (!user) { //If no use exists then error
            return res.json({success: false, message: 'User does not exist'});
        }

        const isMatch = await bcrypt.compare(password, user.password); //compares the stored hashes password with the current password
        if (!isMatch) {
            return res.json({success: false, message: 'Invalid credentials'});
        }

        const token = generateToken(user._id.toString()); // If successfull login then generate a token
        res.json({success: true, token});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Get User data using Token (JWT)
export const getUserData = async (req, res) => {
    try {
        const {user} = req; // With the help of token we verify correct user
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Get all cars for the frontend
export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvaliable: true }); // get all cars which is currently available
        res.json({success: true, cars});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}