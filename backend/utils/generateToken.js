import jwt from "jsonwebtoken"
import { EN_VARS } from "../config/enVars.js"

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, EN_VARS.JWT_SECRET, { expiresIn: "15d"});

    res.cookie("jwt-netflix", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //in miliseconds
        httpOnly: true,
        sameSite: "strict",
        secure: EN_VARS.NODE_ENV != "development"
    });
    return token;
}