import User from "../models/userModel.js";
import { schemas, validate, validateParams, validateQuery } from "../utils/validation.js";
import Joi from "joi";

export const addRating = [
    validate(schemas.thumbRating),
    async (req, res) => {
        try {
            const { mediaId, mediaType, rating } = req.body;

            // Find user
            const user = await User.findById(req.user._id);
            if (!user) return res.status(404).json({ success: false, message: "User not found" });

            // Check if already rated this media
            const existingRatingIndex = user.ratings.findIndex(r =>
                r.mediaId === mediaId && r.mediaType === mediaType
            );

            let updatedRatings;
            if (existingRatingIndex !== -1) {
                // Update existing rating
                user.ratings[existingRatingIndex] = { mediaId, mediaType, rating, updatedAt: new Date() };
                updatedRatings = user.ratings;
            } else {
                // Add new rating
                const newRating = {
                    mediaId,
                    mediaType,
                    rating,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                user.ratings.push(newRating);
                updatedRatings = user.ratings;
            }

            await user.save();

            res.status(200).json({
                success: true,
                content: updatedRatings,
                message: rating ? "Added to favorites" : "Removed from favorites"
            });
        } catch (error) {
            console.error("Error in addRating controller: ", error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
];

export const removeRating = [
    validateParams(Joi.object({
        mediaId: Joi.number().integer().positive().required().messages({
            'number.base': 'Media ID must be a number',
            'number.integer': 'Media ID must be an integer',
            'number.positive': 'Media ID must be a positive number',
            'any.required': 'Media ID is required'
        }),
        mediaType: Joi.string().valid('movie', 'tv').required().messages({
            'string.empty': 'Media type is required',
            'string.valid': 'Media type must be either movie or tv'
        })
    })),
    async (req, res) => {
        try {
            const { mediaId, mediaType } = req.params;

            // Find user
            const user = await User.findById(req.user._id);
            if (!user) return res.status(404).json({ success: false, message: "User not found" });

            // Remove rating
            user.ratings = user.ratings.filter(r =>
                !(r.mediaId === mediaId && r.mediaType === mediaType)
            );

            await user.save();

            res.status(200).json({
                success: true,
                content: user.ratings,
                message: "Rating removed"
            });
        } catch (error) {
            console.error("Error in removeRating controller: ", error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
];

export const getUserRatings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, content: user.ratings });
    } catch (error) {
        console.error("Error in getUserRatings controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};