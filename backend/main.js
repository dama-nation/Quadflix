import path from "path"
import express from "express";
import authRoutes from "./routes/authRoutes.js"
import moviesRoutes from "./routes/movieRoutes.js"
import tvRoutes from "./routes/tvRoutes.js"
import connectDB from "./config/db.js"
import { EN_VARS } from "./config/enVars.js"
import cookieParser from "cookie-parser";
import {  protectRoute } from "./middleware/protectRoute.js"
import searchRoutes from "./routes/searchRoute.js"
import listRoutes from "./routes/listRoutes.js"
import ratingRoutes from "./routes/ratingRoutes.js"
import watchHistoryRoutes from "./routes/watchHistoryRoutes.js"

const app = express();
const PORT = EN_VARS.PORT;
const __dirname = path.resolve()

app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/movie', protectRoute, moviesRoutes)
app.use('/api/tv', protectRoute, tvRoutes)
app.use('/api/search', protectRoute, searchRoutes)
app.use('/api/list', listRoutes)
app.use('/api/rating', protectRoute, ratingRoutes)
app.use('/api/watch-history', protectRoute, watchHistoryRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`)
    connectDB();

})


