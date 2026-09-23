import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useRatingStore = create((set, get) => ({
    ratings: [],
    isLoading: false,

    fetchRatings: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get('/api/rating');
            set({ ratings: res.data.content, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch ratings:", error);
            set({ ratings: [], isLoading: false });
        }
    },

    addRating: async (mediaId, mediaType, rating) => {
        try {
            const payload = {
                mediaId,
                mediaType,
                rating
            };

            const res = await axios.post('/api/rating/rate', payload);
            set({ ratings: res.data.content });
            toast.success(rating ? "Added to favorites" : "Removed from favorites");
        } catch (error) {
            console.error("Failed to add rating:", error);
            toast.error(error.response?.data?.message || "Failed to update rating");
        }
    },

    removeRating: async (mediaId, mediaType) => {
        try {
            const res = await axios.delete(`/api/rating/remove/${mediaId}/${mediaType}`);
            set({ ratings: res.data.content });
            toast.success("Rating removed");
        } catch (error) {
            console.error("Failed to remove rating:", error);
            toast.error("Failed to remove rating");
        }
    },

    hasRated: (mediaId, mediaType) => {
        const { ratings } = get();
        return ratings.some(r => String(r.mediaId) === String(mediaId) && r.mediaType === mediaType);
    },

    getRating: (mediaId, mediaType) => {
        const { ratings } = get();
        const rating = ratings.find(r => String(r.mediaId) === String(mediaId) && r.mediaType === mediaType);
        return rating ? rating.rating : null;
    }
}));