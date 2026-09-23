import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Info, Loader2 } from "lucide-react";
import axios from "axios";
import MediaSlider from "../components/MediaSlider";
import TopTenSlider from "../components/TopTenSlider";

const NewAndPopular = () => {
    const [heroMedia, setHeroMedia] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Autoplay Trailer States
    const [trailerKey, setTrailerKey] = useState(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const TMDB_ORIGINAL_URL = "https://image.tmdb.org/t/p/original";

    // 1. Fetch Random Hero Media (Trending Movie or TV Show)
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const fetchHero = async () => {
            try {
                // Randomly choose between movie or tv for the hero
                const isMovie = Math.random() > 0.5;
                const endpoint = isMovie ? '/api/movie/discover?year=2026' : '/api/tv/discover?year=2026';
                const res = await axios.get(endpoint);
                const heroData = res.data.content || res.data.results || res.data;
                const heroArray = Array.isArray(heroData) ? heroData : [heroData];
                
                if (heroArray.length > 0 && isMounted) {
                    const randomHero = heroArray[Math.floor(Math.random() * heroArray.length)];
                    // Ensure media_type is set so we can link properly
                    randomHero.media_type = randomHero.media_type || (isMovie ? 'movie' : 'tv');
                    setHeroMedia(randomHero);
                }
            } catch (error) {
                console.error("Failed to fetch hero data:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchHero();
        return () => { isMounted = false; };
    }, []);

    // 2. Fetch Official Trailer for Hero Media
    useEffect(() => {
        if (!heroMedia) return;
        
        let isMounted = true;
        let timeoutId; 
        
        setIsVideoPlaying(false);
        setTrailerKey(null);

        const currentMediaType = heroMedia.media_type || "movie";

        const fetchTrailer = async () => {
            try {
                const res = await axios.get(`/api/${currentMediaType}/${heroMedia.id}/videos`);
                const videos = res.data.trailer || res.data.content || res.data.results || [];
                
                const officialTrailer = videos.find(
                    (vid) => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")
                );

                if (officialTrailer && isMounted) {
                    setTrailerKey(officialTrailer.key);
                    
                    timeoutId = setTimeout(() => {
                        if (isMounted) setIsVideoPlaying(true);
                    }, 2500);
                }
            } catch (error) {
                console.log("No trailer found for hero media.");
            }
        };

        fetchTrailer();
        
        return () => { 
            isMounted = false; 
            if (timeoutId) clearTimeout(timeoutId); 
        };
    }, [heroMedia]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            </div>
        );
    }

    const mediaType = heroMedia?.media_type || "movie";
    const releaseYear = heroMedia?.release_date?.substring(0, 4) || heroMedia?.first_air_date?.substring(0, 4) || "";

    return (
        <div className="relative min-h-screen bg-[#09090b] pb-24 overflow-x-hidden text-white">
            
            {/* ================= HERO SECTION ================= */}
            {heroMedia && (
                <div className="relative w-full h-[85vh] md:h-[95vh] mt-16 md:mt-20 flex items-end mb-12 overflow-hidden bg-zinc-950">
                    
                    {/* Background Visuals Layer */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        
                        {/* The Silent YouTube Iframe */}
                        {trailerKey && (
                            <div className="absolute inset-0 w-full h-[150%] top-[-25%] pointer-events-none">
                                <iframe
                                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailerKey}&modestbranding=1&playsinline=1`}
                                    title="Hero Trailer"
                                    className="w-full h-full object-cover opacity-60 pointer-events-none"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}

                        {/* The Poster Image */}
                        <img 
                            src={`${TMDB_ORIGINAL_URL}${heroMedia.backdrop_path || heroMedia.poster_path}`}
                            alt={heroMedia.title || heroMedia.name}
                            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ease-in-out ${isVideoPlaying ? 'opacity-0' : 'opacity-80'}`}
                        />
                        
                        {/* Gradients */}
                        <div className="absolute inset-0 bg-linear-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
                        <div className="absolute inset-0 bg-linear-to-r from-[#09090b] via-[#09090b]/60 to-transparent w-full md:w-2/3" />
                        <div className="absolute inset-0 bg-linear-to-b from-[#09090b] via-[#09090b]/40 to-transparent h-32 md:h-48 pointer-events-none" />
                    </div>

                    <div className="relative z-10 w-full px-6 md:px-16 pb-20 md:pb-28 max-w-4xl">
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
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] mb-6 leading-[1.1] max-w-4xl opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
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
                <TopTenSlider title="Top 10 Movies of 2026" fetchUrl="/api/movie/discover?year=2026" mediaType="movie" />
                <TopTenSlider title="Top 10 TV Shows of 2026" fetchUrl="/api/tv/discover?year=2026" mediaType="tv" />
                <MediaSlider title="Hot Action Movies (2026)" fetchUrl="/api/movie/discover?year=2026&genre=action" mediaType="movie"/>
                <MediaSlider title="Trending Comedy Shows (2026)" fetchUrl="/api/tv/discover?year=2026&genre=comedy" mediaType="tv" />
                <MediaSlider title="Sci-Fi & Fantasy (2026)" fetchUrl="/api/movie/discover?year=2026&genre=scifi" mediaType="movie"/>
                <MediaSlider title="Must-Watch Drama (2026)" fetchUrl="/api/tv/discover?year=2026&genre=drama" mediaType="tv" />
            </div>
            
        </div>
    );
};

export default NewAndPopular;