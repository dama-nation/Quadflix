import mongoose from "mongoose";
import User from "./backend/models/userModel.js";
import { EN_VARS } from "./backend/config/enVars.js";
import dotenv from "dotenv";

dotenv.config();

const updateAvatars = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        for (const user of users) {
            if (user.image && user.image.endsWith('.png')) {
                user.image = user.image.replace('.png', '.svg');
                await user.save();
            }
        }
        console.log("Successfully updated all users to use SVG avatars!");
        process.exit(0);
    } catch (error) {
        console.error("Failed to update avatars:", error);
        process.exit(1);
    }
};

updateAvatars();
