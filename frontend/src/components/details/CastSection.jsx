const CastSection = ({ cast }) => {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="px-6 md:px-16 max-w-7xl mx-auto mb-16 relative z-40">
      <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-3">Cast</h3>
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
        {cast.slice(0, 15).map(actor => (
          <div key={actor.id} className="w-30 md:w-35 flex flex-col gap-3 shrink-0 snap-start">
            {actor.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                alt={actor.name}
                className="w-full aspect-2/3 object-cover rounded-xl shadow-lg border border-white/10"
              />
            ) : (
              <div className="w-full aspect-2/3 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/10 p-2">
                <span className="text-zinc-600 text-xs text-center font-medium">No Image</span>
              </div>
            )}
            <div>
              <p className="text-white text-sm font-bold truncate" title={actor.name}>{actor.name}</p>
              <p className="text-zinc-400 text-xs truncate" title={actor.character}>{actor.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastSection;