import express from "express"
import { searchPerson, searchMovie, searchTv, getSearchHistory, removeItemFromSearchHistory, searchMulti, getSearchSuggestions } from "../controllers/searchController.js"

const router = express.Router();

router.get("/person/:query", searchPerson)
router.get("/movie/:query", searchMovie)
router.get("/tv/:query", searchTv)
router.get("/multi", searchMulti)
router.get("/suggestions", getSearchSuggestions)
router.get("/history", getSearchHistory)
router.delete("/history/:id", removeItemFromSearchHistory)

export default router;