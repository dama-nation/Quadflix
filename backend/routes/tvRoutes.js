import express from "express"
import { getTrendingTv,
         getTvTrailers,
         getTvDetails,
         getSimilarTvs,
         getTvsByCategory,
         getPlatformTvs,
         getTvSeasonDetails,
         getDiscoverTvs
         } from "../controllers/tvController.js"

const router = express.Router()

router.get("/trending", getTrendingTv)
router.get("/discover", getDiscoverTvs)
router.get("/platform/:platformName", getPlatformTvs)
router.get("/:id/trailers", getTvTrailers)
router.get("/:id/details", getTvDetails)
router.get("/:id/similar", getSimilarTvs)
router.get("/:category", getTvsByCategory)
router.get("/:id/season/:seasonNumber", getTvSeasonDetails)

export default router