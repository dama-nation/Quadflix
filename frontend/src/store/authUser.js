import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
    user: null,
    isCheckingAuth: true,

    login: async (credentials) => {
        try {
            // Ensure this points to your exact Express auth route
            const res = await axios.post('/api/auth/login', credentials);
            
            // Assuming your backend sends the user object and a token in a cookie
            set({ user: res.data.user });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed'
            };
        }
    },

    signup: async (credentials) => {
        try {
            const res = await axios.post('/api/auth/signup', credentials);
            set({ user: res.data.user });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    },

    logout: async () => {
        try {
            await axios.post('/api/auth/logout');
            set({ user: null });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axios.get('/api/auth/authCheck');
            set({ user: res.data.user, isCheckingAuth: false });
        } catch (error) {
            set({ user: null, isCheckingAuth: false });
        }
    }
}));