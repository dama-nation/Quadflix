import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import MediaCard from "../components/MediaCard";

const SearchPage = () => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q") || "";

    useEffect(() => {
        let isMounted = true;
        let timeoutId; // Used for debouncing

        if (!query.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        // Set loading to true immediately so the "No results found" message doesn't flash while debouncing
        setIsLoading(true);

        const fetchResults = async () => {
            try {
                const res = await axios.get(`/api/search/multi?query=${encodeURIComponent(query)}`);
                if (isMounted) {
                    // Safety fallback matching the details page logic just in case
                    const rawData = res.data;
                    const data = rawData.content?.results || rawData.content || rawData.results || [];
                    
                    // Filter out people and items without images
                    const validResults = data.filter(
                        item => item.media_type !== "person" && (item.poster_path || item.backdrop_path)
                    );
                    
                    setResults(validResults);
                }
            } catch (error) {
                console.error("Failed to fetch search results:", error);
                if (isMounted) {
                    setResults([]);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        // --- DEBOUNCE LOGIC ---
        // Wait 300ms after the user stops typing before making the API call
        timeoutId = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => { 
            isMounted = false; 
            clearTimeout(timeoutId); // Cancel the pending API call if they keep typing
        };
    }, [query]);

    if (!query) {
        return (
            <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white px-6">
                <Search className="w-16 h-16 text-zinc-600 mb-6" />
                <h1 className="text-3xl font-bold mb-2">Search for something to watch</h1>
                <p className="text-zinc-500 text-center max-w-md">
                    Find your favorite movies and TV series by searching for their titles, genres, or actors.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] pt-[100px] pb-24 text-white px-6 md:px-12 lg:px-16 selection:bg-cyan-500 selection:text-black">
            <div className="max-w-[1600px] mx-auto">
                
                <h1 className="text-2xl md:text-3xl font-bold mb-8">
                    <span className="text-zinc-400">Search results for: </span> 
                    <span className="text-white">"{query}"</span>
                </h1>

                {isLoading ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {results.map((item) => (
                            <div key={item.id} className="aspect-[2/3]">
                                <MediaCard 
                                    media={item} 
                                    mediaType={item.media_type || "movie"} 
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-20 text-zinc-500">
                        <p className="text-lg">No results found for "{query}". Try searching for something else.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;