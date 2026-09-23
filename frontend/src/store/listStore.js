import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useListStore = create((set, get) => ({
    myList: [],
    isLoading: false,

    fetchList: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get('/api/list');
            set({ myList: res.data.content, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch list:", error);
            set({ myList: [], isLoading: false });
        }
    },

    addToList: async (media, mediaType) => {
        try {
            const payload = {
                id: media.id,
                title: media.title || media.name,
                name: media.name || media.title,
                poster_path: media.poster_path,
                backdrop_path: media.backdrop_path,
                media_type: mediaType || media.media_type,
                vote_average: media.vote_average,
                release_date: media.release_date,
                first_air_date: media.first_air_date
            };

            const res = await axios.post('/api/list/add', payload);
            set({ myList: res.data.content });
            toast.success("Added to My List");
        } catch (error) {
            console.error("Failed to add to list:", error);
            toast.error(error.response?.data?.message || "Failed to add to list");
        }
    },

    removeFromList: async (id, mediaType) => {
        try {
            const res = await axios.delete(`/api/list/remove/${mediaType}/${id}`);
            set({ myList: res.data.content });
            toast.success("Removed from My List");
        } catch (error) {
            console.error("Failed to remove from list:", error);
            toast.error("Failed to remove from list");
        }
    },

    isInList: (id) => {
        const { myList } = get();
        return myList.some(item => item.id.toString() === id.toString());
    }
}));
