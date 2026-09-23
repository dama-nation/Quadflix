import User from "../models/userModel.js";
import { schemas, validate } from "../utils/validation.js";

export const updateWatchProgress = [
    validate(schemas.watchHistory),
    async (req, res) => {
        try {
            const { mediaId, mediaType, progress, currentTime, episode, season } = req.body;

            // Find user
            const user = await User.findById(req.user._id);
            if (!user) return res.status(404).json({ success: false, message: "User not found" });

            // Check if already in watch history
            const existingIndex = user.watchHistory.findIndex(item =>
                item.mediaId === mediaId && item.mediaType === mediaType
            );

            const watchItem = {
                mediaId,
                mediaType,
                progress: progress || 0, // percentage 0-100
                currentTime: currentTime || 0, // seconds
                episode: episode || null,
                season: season || null,
                updatedAt: new Date()
            };

            if (existingIndex !== -1) {
                // Update existing entry
                user.watchHistory[existingIndex] = watchItem;
            } else {
                // Add new entry
                watchItem.createdAt = new Date();
                user.watchHistory.push(watchItem);
            }

            await user.save();

            res.status(200).json({
                success: true,
                content: user.watchHistory,
                message: "Watch progress updated"
            });
        } catch (error) {
            console.error("Error in updateWatchProgress controller: ", error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
];

export const getWatchHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Sort by most recently updated
        const sortedHistory = [...user.watchHistory].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        res.status(200).json({ success: true, content: sortedHistory });
    } catch (error) {
        console.error("Error in getWatchHistory controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const clearWatchHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.watchHistory = [];
        await user.save();

        res.status(200).json({ success: true, content: [], message: "Watch history cleared" });
    } catch (error) {
        console.error("Error in clearWatchHistory controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};