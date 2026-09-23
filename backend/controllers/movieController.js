import { fetchFromTMDB } from "../services/tmdbService.js";
import { schemas, validateParams, validateQuery } from "../utils/validation.js";
import Joi from "joi";

const GENRE_MAP = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    scifi: 878,
    "sci-fi": 878,
    thriller: 53,
    war: 10752,
    western: 37,
    reality: 99,
    kids: 10751,
};

export const getTrendingMovie = async (req, res) => {
    const page = req.query.page || 1;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`);
        res.json({ success: true, content: data.results, totalPages: data.total_pages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getMovieTrailers = [
    validateParams(schemas.tmdbId),
    async (req, res) => {
        const { id } = req.params;
        try {
            const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
            res.json({ success: true, trailer: data.results });
        } catch (error) {
            if (error.message.includes("404")) {
                return res.status(404).send(null);
            }
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
];

export const getMovieDetails = [
    validateParams(schemas.tmdbId),
    async (req, res) => {
        const { id } = req.params;

        try {
            // We added &append_to_response=credits,videos to grab the cast and trailers in one shot!
            const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=credits,videos`);

            // We structure it cleanly so your React frontend knows exactly where to look
            res.status(200).json({
                success: true,
                content: {
                    details: data,
                    cast: data.credits?.cast || [],
                    trailers: data.videos?.results || []
                }
            });

        } catch (error) {
            if (error.message.includes("404")) {
                return res.status(404).send(null);
            }
            console.error("Error in getMovieDetails:", error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
];

export const getSimilarMovies = [
    validateParams(schemas.tmdbId),
    async (req, res) => {
        const { id } = req.params;
        try {
            const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
            res.status(200).json({ success: true, similar: data.results });
        } catch (error) {
            console.error("Error in getSimilarMovies:", error.message);
            if (error.message.includes("Status: 404")) {
                return res.status(404).json({ success: false, message: "Similar movies not found for this ID." });
            }
            res.status(500).json({ success: false, message: "Internal server error", details: error.message });
        }
    }
];

export const getMoviesByCategory = [
    validateParams(Joi.object({
        category: Joi.string().valid(...Object.keys(GENRE_MAP), 'netflix', 'disney+', 'hulu', 'hbo max', 'max', 'crunchyroll', 'amc+', 'tv+', 'apple tv+', 'popular', 'top_rated', 'upcoming', 'now_playing').required()
    })),
    async (req, res) => {
        const { category } = req.params;
        try {
            const genreId = GENRE_MAP[category.toLowerCase()];
            const url = genreId
                ? `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1`
                : `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`;
            const data = await fetchFromTMDB(url);
            res.status(200).json({ success: true, content: data.results });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
];

export const getMoviesByGenre = [
    validateParams(Joi.object({
        genreId: Joi.string().required()
    })),
    async (req, res) => {
        const { genreId } = req.params;
        try {
            const id = GENRE_MAP[genreId.toLowerCase()] || genreId;
            const data = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?with_genres=${id}&language=en-US&page=1`);
            res.status(200).json({ success: true, content: data.results });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
];

const MOVIE_PLATFORM_MAPPING = {
    netflix: { providerId: "8" },
    "prime video": { providerId: "9|119" },
    prime: { providerId: "9|119" },
    "disney+": { providerId: "337" },
    disney: { providerId: "337" },
    hulu: { providerId: "15" },
    hbo: { providerId: "1899|384" },
    "hbo max": { providerId: "1899|384" },
    max: { providerId: "1899|384" },
    crunchyroll: { providerId: "283" },
    "amc+": { providerId: "528" },
    amc: { providerId: "528" },
    "tv+": { providerId: "350" },
    "apple tv+": { providerId: "350" },
    apple: { providerId: "350" }
};

const MOVIE_GENRE_MAP = {
    action: 28,
    adventure: 12,
    animation: 16,
    anime: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    scifi: 878,
    "sci-fi": 878,
    thriller: 53,
    war: 10752,
    western: 37
};

export const getDiscoverMovies = [
    validateQuery(schemas.discoverMovieQuery),
    async (req, res) => {
        const { year, genre, sort_by = 'popularity.desc', page = 1 } = req.query;
        try {
            let url = `https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=${sort_by}&page=${page}`;

            if (year) {
                url += `&primary_release_year=${year}`;
            }

            if (genre && MOVIE_GENRE_MAP[genre.toLowerCase()]) {
                url += `&with_genres=${MOVIE_GENRE_MAP[genre.toLowerCase()]}`;
            }

            const data = await fetchFromTMDB(url);
            res.status(200).json({ success: true, content: data.results, totalPages: data.total_pages });
        } catch (error) {
            console.error("Error in getDiscoverMovies:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
];

export const getPlatformMovies = [
    validateParams(Joi.object({
        platformName: Joi.string().required()
    })),
    validateQuery(schemas.platformMovieQuery),
    async (req, res) => {
        const { platformName } = req.params;
        const { genre, page = 1 } = req.query; // Accept page number
        try {
            const cleanName = decodeURIComponent(platformName).toLowerCase().trim();
            const platform = MOVIE_PLATFORM_MAPPING[cleanName] || MOVIE_PLATFORM_MAPPING[cleanName.replace(/\s+/g, '')];

            let url = `https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&watch_region=US&page=${page}`;

            if (platform?.providerId) {
                url += `&with_watch_providers=${platform.providerId}`;
            }

            if (genre && MOVIE_GENRE_MAP[genre.toLowerCase()]) {
                url += `&with_genres=${MOVIE_GENRE_MAP[genre.toLowerCase()]}`;
            }

            const data = await fetchFromTMDB(url);
            res.status(200).json({ success: true, content: data.results, totalPages: data.total_pages });
        } catch (error) {
            console.error("Error in getPlatformMovies:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
];