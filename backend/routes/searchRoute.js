import express from "express"
import { searchPerson, searchMovie, searchTv, searchMulti } from "../controllers/searchController.js"

const router = express.Router();

router.get("/person/:query", searchPerson)
router.get("/movie/:query", searchMovie)
router.get("/tv/:query", searchTv)
router.get("/multi", searchMulti)


export default router;