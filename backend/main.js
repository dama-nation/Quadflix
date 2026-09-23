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

app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/movie', protectRoute, moviesRoutes)
app.use('/api/tv', protectRoute, tvRoutes)
app.use('/api/search', protectRoute, searchRoutes)
app.use('/api/list', listRoutes)
app.use('/api/rating', protectRoute, ratingRoutes)
app.use('/api/watch-history', protectRoute, watchHistoryRoutes)


app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`)
    connectDB();

})

// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer EN_VARS.TMDB_API_KEY'
//   }
// };

// fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));
