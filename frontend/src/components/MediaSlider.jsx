import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "./MediaCard";
import SkeletonLoader from "../utils/components/SkeletonLoader";

const MediaSlider = ({ title, fetchUrl, mediaType = "movie" }) => {
    const [mediaList, setMediaList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const sliderRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const fetchMedia = async () => {
            try {
                const res = await axios.get(fetchUrl);
                const data = res.data.content || res.data.results || res.data;
                if (isMounted) setMediaList(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(`Failed to fetch ${title}:`, error);
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
        <div className="mb-8 w-full relative group/slider">
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide mb-4 px-6 md:px-12">
                {title}
            </h2>

            {/* Left Scroll Button */}
            <button onClick={() => scroll("left")} className="absolute left-0 top-[55%] -translate-y-1/2 z-20 bg-zinc-950/80 text-cyan-500 w-12 h-[85%] hidden md:flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-sm rounded-r-xl">
                <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Slider Container */}
            <div ref={sliderRef} className="flex gap-4 overflow-x-auto px-6 md:px-12 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
                {isLoading ? (
                    // Enhanced Skeleton Loaders
                    [...Array(8)].map((_, i) => (
                        <div key={i} className="w-32.5 sm:w-40 md:w-45 aspect-2/3">
                            <SkeletonLoader
                                width="100%"
                                height="100%"
                                borderRadius="rounded-xl"
                                animation="pulse"
                            />
                        </div>
                    ))
                ) : (
                    // Render Cards
                    mediaList.map((media) => (
                        <div key={media.id} className="w-32.5 sm:w-40 md:w-45 shrink-0 snap-start">
                            <MediaCard media={media} mediaType={mediaType} />
                        </div>
                    ))
                )}
            </div>

            {/* Right Scroll Button */}
            <button onClick={() => scroll("right")} className="absolute right-0 top-[55%] -translate-y-1/2 z-20 bg-zinc-950/80 text-cyan-500 w-12 h-[85%] hidden md:flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-sm rounded-l-xl">
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>
    );
};

export default MediaSlider;