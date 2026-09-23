import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Info, Loader2, Volume2, VolumeX } from "lucide-react";
import axios from "axios";
import MediaSlider from "../../components/MediaSlider";
import TopTenSlider from "../../components/TopTenSlider";

const HomePage = ({ type = "all" }) => {
    const [heroMedia, setHeroMedia] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const TMDB_ORIGINAL_URL = "https://image.tmdb.org/t/p/original";

    // 1. Fetch Random Hero Media
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const fetchHero = async () => {
            try {
                const endpoint = type === 'tv' ? '/api/tv/trending' : '/api/movie/trending';
                const res = await axios.get(endpoint);
                const heroData = res.data.content || res.data.results || res.data;
                const heroArray = Array.isArray(heroData) ? heroData : [heroData];

                if (heroArray.length > 0 && isMounted) {
                    setHeroMedia(heroArray[Math.floor(Math.random() * heroArray.length)]);
                }
            } catch (error) {
                console.error("Failed to fetch hero data:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchHero();
        return () => { isMounted = false; };
    }, [type]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            </div>
        );
    }

    const mediaType = heroMedia?.media_type || (type === "tv" ? "tv" : "movie");
    const releaseYear = heroMedia?.release_date?.substring(0, 4) || heroMedia?.first_air_date?.substring(0, 4) || "";

    return (
        <div className="relative min-h-screen bg-[#09090b] pb-24 overflow-x-hidden text-white selection:bg-cyan-500 selection:text-black">
            
            {/* ================= HERO SECTION ================= */}
            {heroMedia && (
                <div className="relative w-full h-[85vh] md:h-[95vh] mt-16 md:mt-20 flex items-end mb-12 overflow-hidden bg-zinc-950 select-none">
                    
                    {/* Layer 2: Cover-Up Image */}
                    {(heroMedia.backdrop_path || heroMedia.poster_path) && (
                        <img 
                            src={`${TMDB_ORIGINAL_URL}${heroMedia.backdrop_path || heroMedia.poster_path}`}
                            alt={heroMedia.title || heroMedia.name}
                            className="absolute inset-0 w-full h-full object-cover object-top z-20 pointer-events-none opacity-80"
                        />
                    )}
                    
                    {/* Layer 3: Gradients */}
                    <div className="absolute inset-0 bg-linear-to-t from-[#09090b] via-[#09090b]/80 to-transparent z-30 pointer-events-none" />
                    <div className="absolute inset-0 bg-linear-to-r from-[#09090b] via-[#09090b]/60 to-transparent w-full md:w-2/3 z-30 pointer-events-none" />
                    <div className="absolute inset-0 bg-linear-to-b from-[#09090b] via-[#09090b]/40 to-transparent h-32 md:h-48 z-30 pointer-events-none" />

                    <div className="relative z-40 w-full px-6 md:px-16 pb-20 md:pb-28 max-w-4xl pointer-events-none">
                        {/* Premium Badge & Meta */}
                        <div className="flex items-center gap-3 mb-4 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
                            <div className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded bg-linear-to-br from-cyan-400 to-blue-600 text-black font-black text-sm md:text-base shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                Q
                            </div>
                            <span className="text-zinc-200 font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase">{mediaType === "tv" ? "Series" : "Film"}</span>
                            
                            {releaseYear && (
                                <>
                                    <span className="text-zinc-500 text-xs">•</span>
                                    <span className="text-zinc-400 font-medium text-xs md:text-sm bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm border border-white/5">{releaseYear}</span>
                                </>
                            )}
                        </div>
                        
                        {/* Sleek Cinematic Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] mb-6 leading-[1.1] max-w-3xl opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
                            {heroMedia.title || heroMedia.name}
                        </h1>
                        
                        {/* Elegant Description */}
                        <p className="text-zinc-300 text-sm md:text-lg max-w-2xl drop-shadow-xl mb-10 line-clamp-3 leading-relaxed font-medium opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
                            {heroMedia.overview}
                        </p>
                        
                        {/* Premium Buttons */}
                        <div className="flex items-center gap-4 pointer-events-auto opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
                            <Link 
                                to={`/watch/${mediaType}/${heroMedia.id}`}
                                className="group bg-white hover:bg-cyan-500 text-black font-black px-6 md:px-8 py-3 md:py-4 rounded-lg flex items-center gap-3 transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] text-sm md:text-base cursor-pointer"
                            >
                                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current group-hover:text-black transition-colors" />
                                Watch Now
                            </Link>
                            
                            <Link 
                                to={`/details/${mediaType}/${heroMedia.id}`}
                                className="group bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/10 hover:border-white/20 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-lg flex items-center gap-3 transition-all duration-300 active:scale-95 backdrop-blur-md shadow-lg text-sm md:text-base cursor-pointer"
                            >
                                <Info className="w-5 h-5 md:w-6 md:h-6 text-zinc-300 group-hover:text-white transition-colors" />
                                More Info
                            </Link>
                        </div>
                    </div>
                </div>
            )}


            {/* ================= STANDARD ROWS ================= */}
            <div className="space-y-6 relative z-20">
                {type === "all" && (
                    <>
                        <TopTenSlider title="Top 10 Movies Today" fetchUrl={`/api/movie/trending?time_window=day`} mediaType="movie" />
                        <MediaSlider title="Trending TV Shows" fetchUrl="/api/tv/trending" mediaType="tv" />
                        <MediaSlider title="Popular Movies" fetchUrl="/api/movie/popular" mediaType="movie" />
                        <MediaSlider title="Top Rated Series" fetchUrl="/api/tv/top_rated" mediaType="tv" />
                        <MediaSlider title="Action & Adventure" fetchUrl="/api/movie/action" mediaType="movie" />
                        <MediaSlider title="Binge-worthy Dramas" fetchUrl="/api/tv/drama" mediaType="tv" />
                        <MediaSlider title="Sci-Fi & Fantasy" fetchUrl="/api/movie/scifi" mediaType="movie" />
                        <MediaSlider title="Hilarious Comedies" fetchUrl="/api/movie/comedy" mediaType="movie" />
                        <MediaSlider title="Thrilling Mysteries" fetchUrl="/api/tv/mystery" mediaType="tv" />
                        <MediaSlider title="Anime & Animation" fetchUrl="/api/tv/animation" mediaType="tv" />
                    </>
                )}
                {type === "movie" && (
                    <>
                        <TopTenSlider title="Top 10 Movies Today" fetchUrl="/api/movie/trending" mediaType="movie" />
                        <MediaSlider title="Popular Movies" fetchUrl="/api/movie/popular" mediaType="movie" />
                        <MediaSlider title="Top Rated Movies" fetchUrl="/api/movie/top_rated" mediaType="movie" />
                        <MediaSlider title="Action & Adventure" fetchUrl="/api/movie/action" mediaType="movie"/>
                        <MediaSlider title="Comedy" fetchUrl="/api/movie/comedy" mediaType="movie"/>
                        <MediaSlider title="Sci-Fi" fetchUrl="/api/movie/scifi" mediaType="movie"/>
                        <MediaSlider title="Thriller" fetchUrl="/api/movie/thriller" mediaType="movie"/>
                        <MediaSlider title="Horror" fetchUrl="/api/movie/horror" mediaType="movie"/>
                        <MediaSlider title="Romance" fetchUrl="/api/movie/romance" mediaType="movie"/>
                        <MediaSlider title="Family" fetchUrl="/api/movie/family" mediaType="movie"/>
                        <MediaSlider title="Animation" fetchUrl="/api/movie/animation" mediaType="movie"/>
                        <MediaSlider title="History" fetchUrl="/api/movie/history" mediaType="movie"/>
                        <MediaSlider title="Mystery" fetchUrl="/api/movie/mystery" mediaType="movie"/>
                        <MediaSlider title="Western" fetchUrl="/api/movie/western" mediaType="movie"/>
                    </>
                )}
                {type === "tv" && (
                    <>
                        <MediaSlider title="Trending TV Shows" fetchUrl="/api/tv/trending" mediaType="tv" />
                        <MediaSlider title="Popular Series" fetchUrl="/api/tv/popular" mediaType="tv" />
                        <MediaSlider title="Top Rated Series" fetchUrl="/api/tv/top_rated" mediaType="tv" />
                        <MediaSlider title="Action & Adventure" fetchUrl="/api/tv/action" mediaType="tv" />
                        <MediaSlider title="Comedy" fetchUrl="/api/tv/comedy" mediaType="tv" />
                        <MediaSlider title="Drama" fetchUrl="/api/tv/drama" mediaType="tv" />
                        <MediaSlider title="Crime" fetchUrl="/api/tv/crime" mediaType="tv" />
                        <MediaSlider title="Mystery" fetchUrl="/api/tv/mystery" mediaType="tv"/>
                        <MediaSlider title="Sci-Fi & Fantasy" fetchUrl="/api/tv/scifi" mediaType="tv" />
                    </>
                )}
            </div>
            
        </div>
    );
};

export default HomePage;