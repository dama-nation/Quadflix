import User from "../models/userModel.js"
import bcryptjs from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"
import { EN_VARS } from "../config/enVars.js"
import { schemas, validate } from "../utils/validation.js"

export const signup = async (req, res) => {
    // Validation is handled by middleware
    try{
        const { username, email, password } = req.body
        const existingUserByEmail = await User.findOne({email: email})
        if(existingUserByEmail){
            return res.status(400).json({success: false, message: "Email already exists"})
        }
        const existingUserByUsername = await User.findOne({username: username})
        if(existingUserByUsername){
            return res.status(400).json({success: false, message: "Username already exists"})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        const PROFILE_PICS = ["/avatar1.png","/avatar2.png","/avatar3.png"]
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            image
        })

        await newUser.save();
        generateToken(newUser._id, res);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...newUser._doc,
                password: undefined
            },
        })
    }catch(error){
        console.log("Error in signup controller", error.message)
        res.status(500).json({success: false, message: "Internal server error"})
    }
}
export const login = async (req, res) => {
    // Validation is handled by middleware
    try{
        const { email, password } = req.body
        const user = await User.findOne({email: email})
        if(!user){
            return res.status(400).json({success: false, message: "User not found"})
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({success: false, message: "Invalid credentials"})
        }
        generateToken(user._id, res)
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            },
        })
    }catch(error){
        console.log("Error in login controller", error.message)
        res.status(500).json({success: false, message: "Internal server error"})
    }
}
export const logout = async (req, res) => {
    try{
        res.clearCookie("jwt-netflix");
        res.status(200).json({success: true, message: "Logged out successfully"})
    }catch(error){
        console.log("Error in logout controller", error.message)
        res.status(500).json({success: false, message: "Internal server error"})
    }
}
export const authCheck = async (req, res) => {
    console.log("Auth check requested", req.cookies)
    try{
        res.status(200).json({success: true, user: req.user})
    }catch(error){
        console.log("Error in authcheck controller", error.message)
        res.status(500).json({success: false, message: "Internal server error"})
    }
}