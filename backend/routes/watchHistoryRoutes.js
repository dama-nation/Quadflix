import express from "express";
import { updateWatchProgress, getWatchHistory, clearWatchHistory } from "../controllers/watchHistoryController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/update", protectRoute, updateWatchProgress);
router.get("/", protectRoute, getWatchHistory);
router.delete("/clear", protectRoute, clearWatchHistory);

export default router;