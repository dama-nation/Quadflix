import express from "express";
import { addToList, removeFromList, getMyList } from "../controllers/listController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getMyList);
router.post("/add", protectRoute, addToList);
router.delete("/remove/:media_type/:id", protectRoute, removeFromList);

export default router;
