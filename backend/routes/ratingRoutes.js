import express from "express";
import { addRating, removeRating, getUserRatings } from "../controllers/ratingController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/rate", protectRoute, addRating);
router.delete("/remove/:mediaId/:mediaType", protectRoute, removeRating);
router.get("/", protectRoute, getUserRatings);

export default router;