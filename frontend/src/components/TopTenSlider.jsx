import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "./MediaCard";
import SkeletonLoader from "../utils/components/SkeletonLoader";

const TopTenSlider = ({ title, fetchUrl, mediaType = "movie" }) => {
    const [mediaList, setMediaList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const sliderRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const fetchMedia = async () => {
            try {
                const res = await axios.get(fetchUrl);
                const data = res.data.content || res.data.results || res.data;
                // Only keep the top 10 results
                if (isMounted) setMediaList(Array.isArray(data) ? data.slice(0, 10) : []);
            } catch (error) {
                console.error("Failed to fetch top 10:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchMedia();
        return () => { isMounted = false; };
    }, [fetchUrl]);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const amount = sliderRef.current.clientWidth * 0.75;
            sliderRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
        }
    };

    if (!isLoading && mediaList.length === 0) return null;

    return (
        <div className="mb-12 w-full relative group/slider">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-wide mb-6 px-6 md:px-12">
                {title}
            </h2>

            <button onClick={() => scroll("left")} className="absolute left-0 top-[55%] -translate-y-1/2 z-20 bg-zinc-950/80 text-cyan-500 w-12 h-full max-h-[85%] hidden md:flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-md rounded-r-xl">
                <ChevronLeft className="w-8 h-8" />
            </button>

            <div ref={sliderRef} className="flex gap-6 md:gap-8 overflow-x-auto px-6 md:px-12 pb-6 pt-2 snap-x snap-mandatory scrollbar-hide scroll-smooth items-center">
                {isLoading ? (
                    // Enhanced Skeleton Loaders
                    [...Array(10)].map((_, i) => (
                        <div key={i} className="w-35 sm:w-40 md:w-47.5 aspect-2/3">
                            <SkeletonLoader
                                width="100%"
                                height="100%"
                                borderRadius="rounded-xl"
                                animation="pulse"
                            />
                        </div>
                    ))
                ) : (
                    mediaList.map((media, index) => (
                        <div key={media.id} className="relative flex items-center shrink-0 snap-start pl-8 md:pl-12">
                            {/* The Giant Netflix Number */}
                            <span
                                className="absolute -left-2 md:-left-4 -bottom-2.5 text-[120px] md:text-[160px] font-black text-zinc-950 select-none z-0 pointer-events-none drop-shadow-[0_10px_15px_rgba(0,0,0,0.9)] tracking-tighter"
                                style={{ WebkitTextStroke: "3px rgba(82, 82, 91, 0.5)", color: "transparent" }}
                            >
                                {index + 1}
                            </span>

                            <div className="w-32.5 sm:w-37.5 md:w-45 aspect-2/3 relative z-10">
                                <MediaCard media={media} mediaType={mediaType} isTopTen={true}/>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button onClick={() => scroll("right")} className="absolute right-0 top-[55%] -translate-y-1/2 z-20 bg-zinc-950/80 text-cyan-500 w-12 h-full max-h-[85%] hidden md:flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-md rounded-l-xl">
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>
    );
};

export default TopTenSlider;