import express from "express"
import {
    getTrendingMovie,
    getMovieTrailers,
    getMovieDetails,
    getSimilarMovies,
    getMoviesByCategory,
    getMoviesByGenre,
    getPlatformMovies,
    getDiscoverMovies
} from "../controllers/movieController.js"


const router = express.Router()

router.get("/trending", getTrendingMovie)
router.get("/discover", getDiscoverMovies)
router.get("/platform/:platformName", getPlatformMovies)
router.get("/:id/trailers", getMovieTrailers)
router.get("/:id/details", getMovieDetails)
router.get("/:id/similar", getSimilarMovies)
router.get("/genre/:genreId", getMoviesByGenre)
router.get("/:category", getMoviesByCategory)

export default router