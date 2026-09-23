
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useListStore } from '../store/listStore';
import { useRatingStore } from '../store/ratingStore';
import { Play, Plus, Check, ThumbsUp, ThumbsDown, ChevronDown } from "lucide-react";
import useHoverCard from '../utils/hooks/useHoverCard';

import { TMDB_GENRES } from '../utils/constants/genreMap';

const MediaCard = ({ media, mediaType = "movie", isTopTen = false }) => {
    const navigate = useNavigate();
    const { addToList, removeFromList, isInList } = useListStore();
    const { hasRated, getRating, addRating, removeRating } = useRatingStore();
    const inList = isInList(media?.id);
    const userHasRated = hasRated(media?.id, mediaType);
    const userRating = getRating(media?.id, mediaType);

    const handleListToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const type = media.media_type || mediaType;
        if (inList) {
            removeFromList(media.id, type);
        } else {
            addToList(media, type);
        }
    };

    const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
    const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";

    // Use custom hook for hover card functionality
    const { cardRef, isHovered, position, onMouseEnter, onMouseLeave } = useHoverCard({
        hoverWidth: 320,
        hoverHeight: 280,
        delay: 500,
        navbarHeight: 68,
        margin: 20
    });

    if (!media?.poster_path) return null;

    const year = media.release_date?.substring(0, 4) || media.first_air_date?.substring(0, 4) || "N/A";
    const matchScore = media.vote_average ? Math.round(media.vote_average * 10) : 85;

    // Convert genre_ids to actual names, max 3
    const genres = media.genre_ids
        ? media.genre_ids.map(id => TMDB_GENRES[id]).filter(Boolean).slice(0, 3)
        : ["Exciting", "Suspenseful"];

    const hasValidBackdrop = media.backdrop_path && media.backdrop_path !== media.poster_path;

    return (
        <>
            {/* Base Card Render */}
            <Link
                to={`/details/${mediaType}/${media.id}`}
                ref={cardRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={`relative block w-full h-full rounded-md overflow-hidden bg-zinc-900 transition-transform duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
            >
                <img
                    src={`${POSTER_BASE_URL}${media.poster_path}`}
                    alt={media.title || media.name}
                    className="w-full h-full object-cover rounded-md"
                    loading="lazy"
                />
            </Link>

            {/* Render Hover Card in Portal (Avoids clipping) */}
            {isHovered && position && createPortal(
                <div
                    className="absolute z-200 animate-hover-card bg-zinc-950 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,1)] overflow-hidden flex flex-col border border-zinc-800"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        width: `${position.width}px`,
                    }}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <Link to={`/details/${mediaType}/${media.id}`} className="w-full relative aspect-video block cursor-pointer bg-zinc-900 overflow-hidden">
                        {!hasValidBackdrop && (
                            <img
                                src={`${POSTER_BASE_URL}${media.poster_path}`}
                                className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xl scale-125"
                                alt=""
                            />
                        )}
                        <img
                            src={hasValidBackdrop ? `${BACKDROP_BASE_URL}${media.backdrop_path}` : `${POSTER_BASE_URL}${media.poster_path}`}
                            alt={media.title || media.name}
                            className={`relative z-10 w-full h-full ${hasValidBackdrop ? 'object-cover' : 'object-contain py-2'}`}
                        />
                        <div className="absolute inset-0 z-20 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                        <h3 className="absolute z-30 bottom-3 left-4 right-4 text-white font-black text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate">
                            {media.title || media.name}
                        </h3>
                    </Link>

                    <div className="p-4 w-full flex flex-col gap-3 relative z-10 bg-zinc-950">
                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate(`/watch/${mediaType}/${media.id}`)}
                                    className="w-9 h-9 rounded-full bg-white hover:bg-zinc-200 flex items-center justify-center transition-colors shadow-lg"
                                >
                                    <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                                </button>
                                <button
                                    onClick={handleListToggle}
                                    className="w-9 h-9 rounded-full border-2 border-zinc-400 text-zinc-400 hover:border-white hover:text-white bg-zinc-900/50 flex items-center justify-center transition-colors"
                                >
                                    {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (userRating === true) removeRating(media.id, mediaType);
                                        else addRating(media.id, mediaType, true);
                                    }}
                                    className={`w-9 h-9 rounded-full ${userRating === true ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-zinc-900/50 border-zinc-400 text-zinc-400 hover:border-white hover:text-white'} border-2 flex items-center justify-center transition-colors`}
                                    title={userRating === true ? "Remove rating" : "Like"}
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (userRating === false) removeRating(media.id, mediaType);
                                        else addRating(media.id, mediaType, false);
                                    }}
                                    className={`w-9 h-9 rounded-full ${userRating === false ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-zinc-900/50 border-zinc-400 text-zinc-400 hover:border-white hover:text-white'} border-2 flex items-center justify-center transition-colors`}
                                    title={userRating === false ? "Remove rating" : "Dislike"}
                                >
                                    <ThumbsDown className="w-4 h-4" />
                                </button>
                            </div>
                            <Link
                                to={`/details/${mediaType}/${media.id}`}
                                className="w-9 h-9 rounded-full border-2 border-zinc-400 text-zinc-400 hover:border-white hover:text-white bg-zinc-900/50 flex items-center justify-center transition-colors"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white mt-1">
                            <span className="text-green-500">{matchScore}% Match</span>
                            <span className="border border-zinc-500 text-zinc-300 px-1 py-0.5 rounded-[3px] text-[10px] uppercase">{media.media_type === 'tv' || mediaType === 'tv' ? 'TV' : 'Movie'}</span>
                            <span>{year}</span>
                            <span className="border border-zinc-500 text-zinc-300 px-1 py-0.5 rounded-[3px] text-[10px] font-bold">HD</span>
                        </div>

                        {/* Dynamic Genres */}
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium truncate mt-1">
                            {genres.map((genre, index) => (
                                <div key={index} className="flex items-center gap-1.5">
                                    <span className="text-white">{genre}</span>
                                    {index < genres.length - 1 && (
                                        <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default MediaCard;