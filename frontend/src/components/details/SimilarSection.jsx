import MediaCard from "../../components/MediaCard";

const SimilarSection = ({ similarMedia, type }) => {
  if (!similarMedia || similarMedia.length === 0) return null;

  return (
    <div className="px-6 md:px-16 max-w-7xl mx-auto pt-10 border-t border-zinc-800/50 relative z-40">
      <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-3">Similar Content</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
        {similarMedia.map((item) => (
          <div key={item.id}>
            <MediaCard media={item} mediaType={type} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarSection;