import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MonitorPlay } from "lucide-react";

const WatchPage = () => {
    const { type, id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const season = searchParams.get("s") || 1;
    const episode = searchParams.get("e") || 1;

    const [showControls, setShowControls] = useState(true);
    const [activeServer, setActiveServer] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Free Embed Servers
    const SERVERS = [
        {
            name: "CineSrc",
            getUrl: () => type === "movie"
                ? `https://cinesrc.st/embed/movie/${id}`
                : `https://cinesrc.st/embed/tv/${id}?s=${season}&e=${episode}`
        },
        {
            name: "VidSrc",
            getUrl: () => type === "movie"
                ? `https://vidsrc.to/embed/movie/${id}`
                : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
        },
        {
            name: "Vidlink",
            getUrl: () => type === "movie"
                ? `https://vidlink.pro/movie/${id}`
                : `https://vidlink.pro/tv/${id}/${season}/${episode}`
        }
    ];

    // Hide controls on mouse/touch inactivity
    useEffect(() => {
        let timer;
        const handleActivity = () => {
            setShowControls(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        };

        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("touchstart", handleActivity);
        window.addEventListener("click", handleActivity);

        return () => {
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("touchstart", handleActivity);
            window.removeEventListener("click", handleActivity);
            clearTimeout(timer);
        };
    }, []);



    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center selection:bg-cyan-500 selection:text-black">

            {/* --- HEADER CONTROLS --- */}
            <div className={`absolute top-0 inset-x-0 z-50 p-4 md:p-8 flex items-start justify-between bg-linear-to-b from-black/90 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
                >
                    <div className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-1 shadow-lg">
                        <ArrowLeft className="w-4 h-5 md:w-5 md:h-5" />
                    </div>
                </button>

                {/* Server Switcher (Moved to top right) */}
                <div className="flex flex-col items-end gap-1.5 md:gap-2">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 drop-shadow-md">
                        <MonitorPlay className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-500" />
                        <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">Servers</span>
                    </div>
                    <div className="flex gap-1.5 md:gap-2 bg-black/80 p-1 md:p-1.5 rounded-xl backdrop-blur-md border border-white/10 flex-wrap justify-end max-w-[60vw]">
                        {SERVERS.map((server, idx) => (
                            <button
                                key={server.name}
                                onClick={() => setActiveServer(idx)}
                                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-sm font-bold transition-all ${activeServer === idx ? "bg-cyan-500 text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
                            >
                                {server.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- FULL MOVIE/TV EMBED PLAYER --- */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                    {isLoading ? (
                        <div className="text-white text-center">
                            <div className="animate-spin rounded-full border-4 border-t-cyan-500 w-12 h-12"></div>
                            <p className="mt-4">Loading player...</p>
                        </div>
                    ) : (
                        <iframe
                            src={SERVERS[activeServer].getUrl()}
                            title="Stream Player"
                            className="w-full h-full border-none"
                            allow="autoplay; fullscreen; encrypted-media; picture-in-picture; screen-wake-lock"
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setIsLoading(false);
                                // Could show error message here
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default WatchPage;