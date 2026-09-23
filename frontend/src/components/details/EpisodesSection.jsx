/* eslint-disable react/prop-types */
import React from "react";
import { Loader2, ChevronDown, Play } from "lucide-react";

const EpisodesSection = ({
  type,
  selectedSeason,
  setSelectedSeason,
  seasons,
  episodes,
  isFetchingEpisodes,
  navigateToWatchEpisode
}) => {
  if (type !== "tv" || !seasons || seasons.length === 0) return null;

  return (
    <div className="px-6 md:px-16 max-w-7xl mx-auto mb-16 relative z-40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold text-white border-l-4 border-cyan-500 pl-3">Episodes</h2>

          <div className="relative">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="appearance-none bg-zinc-900 border border-zinc-700 hover:border-cyan-500 text-white font-medium py-2 pl-4 pr-10 rounded-lg cursor-pointer focus:outline-none transition-colors"
            >
              {seasons.map((season) => (
                <option key={season.id} value={season.season_number}>
                  Season {season.season_number}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {isFetchingEpisodes ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
      ) : (
        <div className="max-h-150 overflow-y-auto pr-4 pb-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="flex flex-col gap-3 md:gap-4">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                onClick={() => {
                  if (type === 'tv') {
                    navigateToWatchEpisode(`${selectedSeason}&e=${episode.episode_number}`);
                  }
                }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 md:p-4 flex flex-row gap-3 md:gap-4 hover:bg-zinc-800 transition-colors group cursor-pointer"
              >
                <div className="relative w-28 md:w-32 aspect-video rounded-md overflow-hidden shrink-0 bg-zinc-950">
                  {episode.still_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                      alt={episode.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800"></div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-cyan-500 fill-cyan-500" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-white font-bold text-sm truncate mb-1">
                    {episode.episode_number}. {episode.name}
                  </h3>
                  <p className="text-zinc-500 text-xs line-clamp-2">
                    {episode.overview || "No overview available."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodesSection;