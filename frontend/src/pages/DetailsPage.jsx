import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Play, ArrowLeft, Star, Calendar, Clock, Loader2, ChevronDown, Plus, Check, Volume2, VolumeX, ThumbsUp, ThumbsDown } from "lucide-react";
import { useListStore } from "../store/listStore";
import { useRatingStore } from "../store/ratingStore";
import TrailerBackground from "../components/details/TrailerBackground";
import MediaInfo from "../components/details/MediaInfo";
import CastSection from "../components/details/CastSection";
import EpisodesSection from "../components/details/EpisodesSection";
import SimilarSection from "../components/details/SimilarSection";

const DetailsPage = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();

    const [media, setMedia] = useState(null);
    const [similarMedia, setSimilarMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const playerRef = useRef(null);

    const { myList, addToList, removeFromList, isInList } = useListStore();
    const { ratings, hasRated, getRating, addRating, removeRating } = useRatingStore();
    const inList = media ? isInList(media.id) : false;

    const handleListToggle = () => {
        if (!media) return;
        if (inList) {
            removeFromList(media.id, type);
        } else {
            addToList(media, type);
        }
    };

    const handleRating = (ratingValue) => {
        if (!media) return;
        if (userRating === ratingValue) {
            removeRating(media.id, type);
        } else {
            addRating(media.id, type, ratingValue);
        }
    };

    // TV Show States
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [isFetchingEpisodes, setIsFetchingEpisodes] = useState(false);

    const TMDB_ORIGINAL_URL = "https://image.tmdb.org/t/p/original";
    const TMDB_W500_URL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [detailsRes, similarRes] = await Promise.all([
                    axios.get(`/api/${type}/${id}/details`),
                    axios.get(`/api/${type}/${id}/similar`)
                ]);

                if (isMounted) {
                    const rawData = detailsRes.data;
                    const data = rawData.content?.details || rawData.content || rawData.details || rawData;

                    if (rawData.content?.cast) data.cast = rawData.content.cast;
                    if (rawData.content?.trailers) data.trailers = rawData.content.trailers;

                    setMedia(data);

                    const similarData = similarRes.data.content ||
                                            similarRes.data.results ||
                                            similarRes.data.similar ||
                                            similarRes.data;

                    const validSimilar = Array.isArray(similarData)
                        ? similarData.filter(item => item.poster_path || item.backdrop_path)
                        : [];

                    setSimilarMedia(validSimilar.slice(0, 18));

                    if (type === "tv" && data?.seasons) {
                        const actualSeasons = data.seasons.filter(s => s.season_number > 0);
                        setSeasons(actualSeasons);
                        if (actualSeasons.length > 0) {
                            setSelectedSeason(actualSeasons[0].season_number);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch details:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [type, id]);

    useEffect(() => {
        if (type !== "tv" || !media) return;
        let isMounted = true;

        const fetchEpisodes = async () => {
            setIsFetchingEpisodes(true);
            try {
                const res = await axios.get(`/api/tv/${id}/season/${selectedSeason}`);
                if (isMounted) {
                    const episodeData = Array.isArray(res.data.content)
                                            ? res.data.content
                                            : (res.data.episodes || res.data.content?.episodes || res.data.data?.episodes || []);
                    setEpisodes(episodeData);
                }
            } catch (error) {
                console.error("Failed to fetch episodes:", error);
            } finally {
                if (isMounted) setIsFetchingEpisodes(false);
            }
        };

        fetchEpisodes();
        return () => { isMounted = false; };
    }, [type, id, selectedSeason, media]);

    const trailers = media?.trailers || [];
    const officialTrailer = trailers.find(t => t.type === "Trailer" && t.site === "YouTube") || trailers.find(t => t.site === "YouTube");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            </div>
        );
    }

    if (!media || Object.keys(media).length === 0 || (!media.title && !media.name)) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
                <p className="text-xl font-bold mb-4">Media not found or data structure is incorrect.</p>
            </div>
        );
    }

    const releaseYear = media.release_date?.substring(0, 4) || media.first_air_date?.substring(0, 4) || "N/A";
    const rating = media.vote_average ? media.vote_average.toFixed(1) : "NR";
    const userRating = media ? getRating(media.id, type) : null;
    const userHasRated = media ? hasRated(media.id, type) : false;
    const duration = type === "movie"
        ? `${Math.floor((media.runtime || 0) / 60)}h ${(media.runtime || 0) % 60}m`
        : `${seasons.length} Season${seasons.length !== 1 ? 's' : ''}`;

    // Navigation helper functions
    const navigateToWatch = (params) => {
        navigate(`/watch/${params}`);
    };

    const navigateToWatchEpisode = (params) => {
        navigate(`/watch/tv/${media.id}?s=${params}`);
    };

    const navigateToDetails = (mediaType, mediaId) => {
        navigate(`/details/${mediaType}/${mediaId}`);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-24 selection:bg-cyan-500 selection:text-black">
            {/* --- NUCLEAR CSS INJECTION: Completely kills YouTube interaction --- */}
            <style>{`
                .youtube-shield iframe {
                    pointer-events: none !important;
                    user-select: none !important;
                }
            `}</style>

            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 md:top-24 md:left-12 z-50 w-10 h-10 md:w-12 md:h-12 bg-black/40 backdrop-blur-md hover:bg-cyan-500 hover:text-black rounded-full flex items-center justify-center border border-white/10 transition-all shadow-lg cursor-pointer"
            >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* --- TRAILER BACKGROUND --- */}
            <TrailerBackground
                officialTrailer={officialTrailer}
                isVideoPlaying={isVideoPlaying}
                backdropPath={media?.backdrop_path}
                posterPath={media?.poster_path}
                onVideoPlay={() => setIsVideoPlaying(true)}
            />

            {/* --- MAIN CONTENT SECTION --- */}
            <MediaInfo
                media={media}
                type={type}
                releaseYear={releaseYear}
                rating={rating}
                userRating={userRating}
                userHasRated={userHasRated}
                duration={duration}
                inList={inList}
                handleListToggle={handleListToggle}
                handleRating={handleRating}
                navigateToWatch={navigateToWatch}
                navigateToDetails={navigateToDetails}
            />

            {/* --- CAST SECTION --- */}
            <CastSection cast={media?.cast} />

            {/* --- TV SHOW: EPISODES --- */}
            <EpisodesSection
                type={type}
                selectedSeason={selectedSeason}
                setSelectedSeason={setSelectedSeason}
                seasons={seasons}
                episodes={episodes}
                isFetchingEpisodes={isFetchingEpisodes}
                navigateToWatchEpisode={navigateToWatchEpisode}
            />

            {/* --- MORE LIKE THIS --- */}
            <SimilarSection similarMedia={similarMedia} type={type} />
        </div>
    );
};

export default DetailsPage;