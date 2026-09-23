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

            res.status(200).json({success: true, content: response.results})
        }catch(error){
            console.log(`Error in searchTv controller, ${error.message} `)
            return res.status(500).json({success: false, message: "Internal Server Error"})
        }
    }
];
