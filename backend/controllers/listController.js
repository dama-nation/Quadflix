import User from "../models/userModel.js";
import { schemas, validate, validateParams, validateQuery } from "../utils/validation.js";
import Joi from "joi";

export const addToList = [
    validate(schemas.listItem),
    async (req, res) => {
        try {
            const { id, title, name, poster_path, backdrop_path, media_type, vote_average, release_date, first_air_date } = req.body;

            // Find user
            const user = await User.findById(req.user._id);
            if (!user) return res.status(404).json({ success: false, message: "User not found" });

            // Check if already in list
            const exists = user.myList.find(item => item.id === id && item.media_type === media_type);
            if (exists) {
                return res.status(400).json({ success: false, message: "Item already in list" });
            }

            // Add to list
            const newItem = {
                id,
                title: title || name,
                poster_path,
                backdrop_path,
                media_type,
                vote_average,
                release_date: release_date || first_air_date,
                addedAt: new Date()
            };

            user.myList.push(newItem);
            await user.save();

            res.status(200).json({ success: true, content: user.myList });
        } catch (error) {
            console.error("Error in addToList controller: ", error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
];

export const removeFromList = [
    validateParams(Joi.object({
        id: Joi.number().integer().positive().required().messages({
            'number.base': 'ID must be a number',
            'number.integer': 'ID must be an integer',
            'number.positive': 'ID must be a positive number',
            'any.required': 'ID is required'
        }),
        media_type: Joi.string().valid('movie', 'tv').required().messages({
            'string.empty': 'Media type is required',
            'string.valid': 'Media type must be either movie or tv'
        })
    })),
    async (req, res) => {
        try {
            const { id, media_type } = req.params;

            const user = await User.findById(req.user._id);
            if (!user) return res.status(404).json({ success: false, message: "User not found" });

            user.myList = user.myList.filter(item => !(item.id.toString() === id && item.media_type === media_type));
            await user.save();

            res.status(200).json({ success: true, content: user.myList });
        } catch (error) {
            console.error("Error in removeFromList controller: ", error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
];

export const getMyList = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, content: user.myList });
    } catch (error) {
        console.error("Error in getMyList controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
