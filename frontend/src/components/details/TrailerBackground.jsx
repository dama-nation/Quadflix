import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

const TrailerBackground = ({ officialTrailer, isVideoPlaying, backdropPath, posterPath, onVideoPlay }) => {
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef(null);

  const toggleMute = () => {
    if (playerRef.current && typeof playerRef.current.isMuted === 'function') {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  // YouTube player initialization using official API callback
  useEffect(() => {
    // Only proceed if we have a trailer to play
    if (!officialTrailer) return;

    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player('youtube-background-player', {
        videoId: officialTrailer.key,
        playerVars: {
          autoplay: 1,
          controls: 0,
          mute: 1,
          loop: 1,
          playlist: officialTrailer.key,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              if (onVideoPlay) onVideoPlay();
            } else if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    // If YT API is already loaded, initialize immediately
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Define global callback for when API loads
      window.onYouTubeIframeAPIReady = () => {
        if (officialTrailer) { // Check again in case it changed
          initPlayer();
        }
      };
    }

    // Cleanup
    return () => {
      // Remove the global callback to prevent memory leaks
      window.onYouTubeIframeAPIReady = null;

      // Destroy player instance
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [officialTrailer]);

  return (
    <>
      {/* --- NUCLEAR CSS INJECTION: Completely kills YouTube interaction --- */}
      <style>{`
        .youtube-shield iframe {
          pointer-events: none !important;
          user-select: none !important;
        }
      `}</style>

      {/* --- CINEMATIC HERO --- */}
      <div className="relative w-full h-[65vh] md:h-[80vh] mt-16 md:mt-20 overflow-hidden bg-zinc-950 youtube-shield select-none">

        {/* Layer 0: YouTube Player */}
        {officialTrailer && (
          <div className="absolute top-1/2 left-1/2 w-[300vw] h-[300vh] sm:w-[150vw] sm:h-[150vh] -translate-x-1/2 -translate-y-1/2 z-0" style={{ pointerEvents: 'none' }}>
            <div id="youtube-background-player" className="w-full h-full opacity-70" style={{ pointerEvents: 'none' }}></div>
          </div>
        )}

        {/* Layer 1: THE GLASS SHIELD */}
        <div className="absolute inset-0 z-10 w-full h-full bg-transparent pointer-events-auto"></div>

        {/* Layer 2: Cover-Up Image */}
        {(backdropPath || posterPath) && (
          <img
            src={`https://image.tmdb.org/t/p/original${backdropPath || posterPath}`}
            alt="Background"
            className={`absolute inset-0 w-full h-full object-cover object-top z-20 pointer-events-none transition-opacity duration-1000 ${isVideoPlaying ? 'opacity-0' : 'opacity-80'}`}
          />
        )}

        {/* Layer 3: Gradients */}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent z-30 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/50 to-transparent w-full md:w-2/3 z-30 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950 via-zinc-950/40 to-transparent h-32 md:h-48 z-30 pointer-events-none" />

        {/* Layer 4: Audio Toggle Button (Clickable above the shield) */}
        {officialTrailer && isVideoPlaying && (
          <button
            onClick={toggleMute}
            className="absolute bottom-40 right-6 md:bottom-56 md:right-16 z-50 w-10 h-10 md:w-12 md:h-12 border border-white/40 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-md cursor-pointer pointer-events-auto"
          >
            {isMuted ? <VolumeX className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
          </button>
        )}
      </div>
    </>
  );
};

export default TrailerBackground;