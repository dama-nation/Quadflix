import { fetchFromTMDB } from "../services/tmdbService.js"
import { schemas, validateParams, validateQuery } from "../utils/validation.js"
import Joi from "joi";

export const getTrendingTv = async (req, res) => {
    try {
        const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/tv/day?language=en-US")
        res.json({ success: true, content: data.results })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getTvTrailers = [
    validateParams(schemas.tmdbId),
    async (req, res) => {
        const { id } = req.params
        try {
            const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`)
            res.json({ success: true, trailer: data.results })
        } catch (error) {
            if (error.message.includes("404")) {
                return res.status(404).send(null)
            }
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
]

export const getTvDetails = [
    validateParams(schemas.tmdbId),
    async (req, res) => {
        const { id } = req.params;

        try {
            // We added &append_to_response=credits,videos to grab the cast and trailers in one shot!
            const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US&append_to_response=credits,videos`);

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
            console.error("Error in getTvDetails:", error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
];

export const getSimilarTvs = [
    validateParams(schemas.tmdbId),
    async (req, res) => {
        const { id } = req.params
        try {
            const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`)
            res.status(200).json({ success: true, similar: data.results })
        } catch (error) {
            console.error("Error in getSimilarTvs:", error.message);
            if (error.message.includes("Status: 404")) {
                return res.status(404).json({ success: false, message: "Similar TV shows not found for this ID." });
            }
            res.status(500).json({ success: false, message: "Internal server error", details: error.message })
        }
    }
];

const TV_GENRE_MAP = {
    action: 10759,
    adventure: 10759,
    animation: 16,
    anime: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    kids: 10762,
    mystery: 9648,
    scifi: 10765,
    "sci-fi": 10765,
    fantasy: 10765,
    western: 37,
    reality: 10764,
    thriller: 9648,
    romance: 10766,
    horror: 9648,
};

export const getTvsByCategory = [
    validateParams(Joi.object({
        category: Joi.string().valid(...Object.keys(TV_GENRE_MAP), 'netflix', 'disney+', 'hulu', 'hbo max', 'max', 'crunchyroll', 'amc+', 'tv+', 'apple tv+', 'popular', 'top_rated', 'on_the_air', 'airing_today').required()
    })),
    async (req, res) => {
        const { category } = req.params;
        try {
            const genreId = TV_GENRE_MAP[category.toLowerCase()];
            const url = genreId
                ? `https://api.themoviedb.org/3/discover/tv?with_genres=${genreId}&language=en-US&page=1`
                : `https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`;
            const data = await fetchFromTMDB(url);
            res.status(200).json({ success: true, content: data.results });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
];

const TV_PLATFORM_MAPPING = {
    netflix: { providerId: "8", networkId: "213" },
    "prime video": { providerId: "9|119", networkId: "1024" },
    prime: { providerId: "9|119", networkId: "1024" },
    "disney+": { providerId: "337", networkId: "2739" },
    disney: { providerId: "337", networkId: "2739" },
    hulu: { providerId: "15", networkId: "453" },
    hbo: { providerId: "1899|384", networkId: "49|3186" },
    "hbo max": { providerId: "1899|384", networkId: "49|3186" },
    max: { providerId: "1899|384", networkId: "49|3186" },
    crunchyroll: { providerId: "283", genreId: "16", originalLanguage: "ja" },
    "amc+": { providerId: "528", networkId: "174" },
    amc: { providerId: "528", networkId: "174" },
    "tv+": { providerId: "350", networkId: "2552" },
    "apple tv+": { providerId: "350", networkId: "2552" },
    apple: { providerId: "350", networkId: "2552" }
};

export const getDiscoverTvs = [
    validateQuery(schemas.discoverMovieQuery), // Reusing the same schema for now
    async (req, res) => {
        const { year, genre, sort_by = 'popularity.desc', page = 1 } = req.query;
        try {
            let url = `https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=${sort_by}&page=${page}`;

            if (year) {
                url += `&first_air_date_year=${year}`;
            }

            if (genre && TV_GENRE_MAP[genre.toLowerCase()]) {
                url += `&with_genres=${TV_GENRE_MAP[genre.toLowerCase()]}`;
            }

            const data = await fetchFromTMDB(url);
            res.status(200).json({ success: true, content: data.results, totalPages: data.total_pages });
        } catch (error) {
            console.error("Error in getDiscoverTvs:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
];

export const getPlatformTvs = [
    validateParams(Joi.object({
        platformName: Joi.string().required()
    })),
    validateQuery(schemas.platformMovieQuery), // Reusing the same schema for now
    async (req, res) => {
        const { platformName } = req.params;
        const { genre, page = 1 } = req.query; // Accept page number
        try {
            const cleanName = decodeURIComponent(platformName).toLowerCase().trim();
            const platform = TV_PLATFORM_MAPPING[cleanName] || TV_PLATFORM_MAPPING[cleanName.replace(/\s+/g, '')];

            let url = `https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.desc&watch_region=US&page=${page}`;

            if (platform?.networkId) {
                url += `&with_networks=${platform.networkId}`;
            } else if (platform?.providerId) {
                url += `&with_watch_providers=${platform.providerId}`;
            }

            if (platform?.originalLanguage) {
                url += `&with_original_language=${platform.originalLanguage}`;
            }

            if (genre && TV_GENRE_MAP[genre.toLowerCase()]) {
                url += `&with_genres=${TV_GENRE_MAP[genre.toLowerCase()]}`;
            } else if (platform?.genreId) {
                url += `&with_genres=${platform.genreId}`;
            }

            const data = await fetchFromTMDB(url);
            res.status(200).json({ success: true, content: data.results, totalPages: data.total_pages });
        } catch (error) {
            console.error("Error in getPlatformTvs:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
];

export const getTvSeasonDetails = [
    validateParams(Joi.object({
        id: Joi.number().integer().positive().required(),
        seasonNumber: Joi.number().integer().min(1).required()
    })),
    async (req, res) => {
        const { id, seasonNumber } = req.params;
        try {
            const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?language=en-US`);
            res.status(200).json({ success: true, content: data.episodes });
        } catch (error) {
            console.error("Error fetching season details:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
];