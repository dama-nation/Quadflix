import axios from "axios"
import { EN_VARS } from "../config/enVars.js"

export const fetchFromTMDB = async (url) => {
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${EN_VARS.TMDB_API_KEY}`
        }
    }; 
    try {
        const response = await axios.get(url, options)
        if(response.status !== 200){
            throw new Error(`Failed to fetch from TMDB API. Status: ${response.statusText}`)
        }
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error fetching from TMDB: ${error.message}`);
            if (error.response) {
                console.error(`TMDB API Response Status: ${error.response.status}`);
                console.error(`TMDB API Response Data: ${JSON.stringify(error.response.data)}`);
                throw new Error(`Failed to fetch from TMDB API. Status: ${error.response.status}, Message: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                console.error("No response received from TMDB API.");
                throw new Error("No response received from TMDB API.");
            } else {
                console.error("Error setting up TMDB API request.");
                throw new Error(`Error setting up TMDB API request: ${error.message}`);
            }
        } else {
            console.error(`Unexpected error in fetchFromTMDB: ${error.message}`);
            throw new Error(`Unexpected error: ${error.message}`);
        }
    }
}   