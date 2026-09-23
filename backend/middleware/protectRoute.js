import jwt from "jsonwebtoken"
import  User  from "../models/userModel.js"
import { EN_VARS } from "../config/enVars.js"

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies["jwt-netflix"]
        if(!token){
            return res.status(401).json({message: "Unauthorized, No token provided"})
        }
        const decoded = jwt.verify(token, EN_VARS.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message: "Unauthorized, Invalid token"})
        }
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        req.user = user;
        next();
    }catch(error){
        console.log("Error in protect route middleware")
        res.status(500).json({message: error.message})
    }
}