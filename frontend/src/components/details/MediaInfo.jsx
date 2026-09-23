import { useNavigate } from "react-router-dom";
import { Play, Star, Calendar, Clock, Plus, Check, ThumbsUp, ThumbsDown } from "lucide-react";

const MediaInfo = ({
  media,
  type,
  releaseYear,
  rating,
  userRating,
  userHasRated,
  watchProgress,
  hasWatchProgress,
  duration,
  inList,
  handleListToggle,
  handleRating,
  navigateToWatch,
  navigateToDetails
}) => {
  const navigate = useNavigate();

  const toggleMute = () => {
    // This would be handled by parent component that has the playerRef
  };

  return (
    <div className="relative z-40 px-6 md:px-16 max-w-7xl mx-auto -mt-32 md:-mt-48 flex flex-col md:flex-row gap-8 md:gap-12 mb-16">
      <div className="hidden sm:block w-48 md:w-72 shrink-0">
        {media.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
            alt="Poster"
            className="w-full rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/10"
          />
        ) : (
          <div className="w-full aspect-2/3 bg-zinc-800 rounded-xl border border-white/10 flex items-center justify-center">
            <span className="text-zinc-500">No Poster</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-end min-w-0">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-md">
          {media.title || media.name || "Unknown Title"}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-zinc-300 mb-4">
          <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 fill-current" /> {rating}
          </div>
          {userRating !== null && (
            <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full ml-2">
              {userRating ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
              {userRating ? "Liked" : "Disliked"}
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4 text-zinc-400" /> {releaseYear}
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4 text-zinc-400" /> {duration}
          </div>
        </div>

        {media.genres?.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {media.genres.map(g => (
              <span key={g.id} className="text-xs font-semibold text-zinc-300 border border-zinc-700 px-3 py-1 rounded-full">
                {g.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
          {media.overview || "No overview available for this title."}
        </p>

        <div className="flex items-center gap-4">
          {hasWatchProgress ? (
            <button
              onClick={() => {
                if (type === 'tv') {
                  navigateToWatch(`${type}/${media.id}?s=${watchProgress.season || 1}&e=${watchProgress.episode || 1}`);
                } else {
                  navigateToWatch(`${type}/${media.id}`);
                }
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current ml-1" />
              Continue Watching
            </button>
          ) : (
            <button
              onClick={() => {
                if (type === 'tv') {
                  navigateToWatch(`${type}/${media.id}?s=1&e=1`);
                } else {
                  navigateToWatch(`${type}/${media.id}`);
                }
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current ml-1" />
              Watch Now
            </button>
          )}

          <button
            onClick={handleListToggle}
            className={`bg-zinc-800 hover:bg-zinc-700 text-white font-bold w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 border ${inList ? 'border-cyan-500 text-cyan-400' : 'border-zinc-700 hover:border-zinc-500'} cursor-pointer`}
            title={inList ? "Remove from My List" : "Add to My List"}
          >
            {inList ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </button>

          <button
            onClick={() => handleRating(true)}
            className={`bg-zinc-800 hover:bg-zinc-700 font-bold w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 border ${userRating === true ? 'border-cyan-500 text-cyan-400' : 'border-zinc-700 text-white hover:border-zinc-500'} cursor-pointer`}
            title={userRating === true ? "Remove rating" : "Like"}
          >
            <ThumbsUp className="w-6 h-6" />
          </button>

          <button
            onClick={() => handleRating(false)}
            className={`bg-zinc-800 hover:bg-zinc-700 font-bold w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 border ${userRating === false ? 'border-cyan-500 text-cyan-400' : 'border-zinc-700 text-white hover:border-zinc-500'} cursor-pointer`}
            title={userRating === false ? "Remove rating" : "Dislike"}
          >
            <ThumbsDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaInfo;