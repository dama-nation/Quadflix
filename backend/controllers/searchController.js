import  User  from "../models/userModel.js"
import { fetchFromTMDB } from "../services/tmdbService.js"
import { schemas, validateParams, validateQuery } from "../utils/validation.js"
import Joi from "joi";

export const searchPerson = [
    validateParams(Joi.object({
        query: Joi.string().min(1).required().messages({
            'string.empty': 'Search query is required',
            'string.min': 'Search query must be at least 1 character'
        })
    })),
    async (req, res) => {
        const { query } = req.params
        try{
            const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`)
            if(response.results.length === 0){
                return res.status(404).send(null)
            }

            await User.findByIdAndUpdate(req.user._id,{
                $push:{
                    searchHistory:{
                        id:response.results[0].id,
                        image:response.results[0].profile_path,
                        title:response.results[0].name,
                        searchType:"person",
                        createdAt:new Date()
                    }
                }
            })
            res.status(200).json({success: true, content: response.results})
        }catch(error){
            console.log(`Error in searchPerson controller: ${error.message}`)
            res.status(500).json({success: false, message: "Internal Server Error"})
        }
    }
];

export const searchMulti = [
    // Validate query from either params or query
    (req, res, next) => {
        const query = req.query.query || req.params.query;
        const page = req.query.page || 1;

        // Simple validation for now - in a real app we might want more sophisticated validation
        if (!query || query.trim() === '') {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }

        // Add validated values to req for use in the controller
        req.validatedQuery = query.trim();
        req.validatedPage = parseInt(page, 10) || 1;
        next();
    },
    async (req, res) => {
        try {
            const { validatedQuery: query, validatedPage: page } = req;
            const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`);
            if (response.results.length === 0) {
                return res.status(404).send(null);
            }

        // We can skip pushing to search history for generic multi-searches or push the first result
        const firstResult = response.results[0];
        if (firstResult) {
            let searchHistoryItem = {
                id: firstResult.id,
                title: firstResult.title || firstResult.name,
                image: firstResult.poster_path || firstResult.profile_path,
                searchType: firstResult.media_type || "multi",
                createdAt: new Date(),
            };

            await User.findByIdAndUpdate(req.user._id, {
                $push: { searchHistory: searchHistoryItem }
            });
        }
        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.log(`Error in searchMulti controller: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
];

export const searchMovie = [
    validateParams(Joi.object({
        query: Joi.string().min(1).required().messages({
            'string.empty': 'Search query is required',
            'string.min': 'Search query must be at least 1 character'
        })
    })),
    async (req, res) => {
        const { query } = req.params
        try{
            const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`)
            if(response.results.length === 0){
                return res.status(404).send(null)
            }

            await User.findByIdAndUpdate(req.user._id,{
                $push:{
                    searchHistory:{
                        id:response.results[0].id,
                        image:response.results[0].poster_path,
                        title:response.results[0].title,
                        searchType:"movie",
                        createdAt:new Date(),
                    }
                }
            })
            res.status(200).json({success: true, content: response.results})
        }catch(error){
            console.log(`Error in searchMovie controller: ${error.message}`)
            res.status(500).json({success: false, message: "Internal Server Error"})
        }
    }
];

export const searchTv = [
    validateParams(Joi.object({
        query: Joi.string().min(1).required().messages({
            'string.empty': 'Search query is required',
            'string.min': 'Search query must be at least 1 character'
        })
    })),
    async (req, res) => {
        const { query } = req.params
        try{
            const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`)
            if(response.results.length === 0){
                return res.status(404).send(null)
            }

            await User.findByIdAndUpdate(req.user._id,{
                $push:{
                    searchHistory:{
                        id:response.results[0].id,
                        image:response.results[0].poster_path,
                        title:response.results[0].name,
                        searchType:"tv",
                        createdAt:new Date(),
                    }
                }
            })
            res.status(200).json({success: true, content: response.results})
        }catch(error){
            console.log(`Error in searchTv controller, ${error.message} `)
            return res.status(500).json({success: false, message: "Internal Server Error"})
        }
    }
];

export const getSearchHistory = async (req, res) => {
    try{
        res.status(200).json({success: true, content: req.user.searchHistory})
    }catch(error){
        console.log(`Error in getSearchHistory controller: ${error.message}`)
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export const removeItemFromSearchHistory = [
    validateParams(Joi.object({
        id: Joi.number().integer().positive().required().messages({
            'number.base': 'ID must be a number',
            'number.integer': 'ID must be an integer',
            'number.positive': 'ID must be a positive number',
            'any.required': 'ID is required'
        })
    })),
    async (req, res) => {
        try {
            let { id } = req.params
            id = Number(id);
            await User.findByIdAndUpdate(req.user._id, {
                $pull:{
                    searchHistory:{id: id},
                }
            })
            res.status(200).json({success: true, message: "Item removed from search history"})
        } catch(error) {
            console.log(`Error in removeItemFromSearchHistory controller: ${error.message}`)
            return res.status(500).json({success: false, message: "Internal Server Error"})
        }
    }
];

export const getSearchSuggestions = [
    validateQuery(Joi.object({
        query: Joi.string().min(2).required().messages({
            'string.empty': 'Search query is required',
            'string.min': 'Search query must be at least 2 characters'
        })
    })),
    async (req, res) => {
        try {
            const { query } = req.query;
            if (!query || query.length < 2) {
                return res.status(200).json({ success: true, content: [] });
            }

            // Find users who have searched for similar terms
            // We'll search through searchHistory for titles that match the query
            const users = await User.find({
                "searchHistory.title": { $regex: query, $options: "i" }
            }).limit(10);

            // Extract unique suggestions from search history
            const suggestions = new Set();
            users.forEach(user => {
                user.searchHistory.forEach(item => {
                    if (item.title.toLowerCase().includes(query.toLowerCase()) && suggestions.size < 10) {
                        suggestions.add(item.title);
                    }
                });
            });

            // If we don't have enough suggestions from history, add some popular searches
            if (suggestions.size < 5) {
                // Add some common prefixes or popular items as fallback
                const fallbackSuggestions = [
                    "Marvel", "DC Comics", "Star Wars", "Harry Potter", "Lord of the Rings",
                    "Game of Thrones", "Stranger Things", "Breaking Bad", "The Office", "Friends"
                ];
                fallbackSuggestions.forEach(suggestion => {
                    if (suggestion.toLowerCase().includes(query.toLowerCase()) && suggestions.size < 10) {
                        suggestions.add(suggestion);
                    }
                });
            }

            res.status(200).json({ success: true, content: Array.from(suggestions) });
        } catch (error) {
            console.log(`Error in getSearchSuggestions controller: ${error.message}`);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
];