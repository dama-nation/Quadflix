import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, X, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authUser";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const searchInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();

    // 1. Initialize search query from URL
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get("q") || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    // 2. Keep local state in sync with URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (location.pathname === '/search') {
            setSearchQuery(params.get("q") || "");
            setIsSearchOpen(true);
        } else {
            setSearchQuery("");

        }
    }, [location.pathname, location.search]);

    // 3. Handle background color on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    // 4. Expand Search Bar & Focus
    const openSearch = () => {
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
    };

    // 5. Clear or Collapse Search
    const clearOrCloseSearch = () => {
        if (searchQuery.trim().length > 0) {
            // If there's text, clear it and go to home, but keep the bar open
            setSearchQuery("");
            navigate(`/`);
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            // If it's already empty, close the bar
            setIsSearchOpen(false);
        }
    };

    // 6. Live Search Change Handler
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.trim().length > 0) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        } else if (location.pathname === '/search') {
            navigate("/");
        }
    };

    const handleKeyDown = (e) => {
        // Keep enter key support for habit, though it searches live now
        if (e.key === 'Enter') {
            if (searchQuery.trim().length > 0) {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            } else if (location.pathname === '/search') {
                navigate("/");
            }
        }
    };


    // Don't show Navbar on auth pages
    if (location.pathname === '/login' || location.pathname === '/signup') {
        return null;
    }

    return (
        <nav className={`fixed top-0 w-full z-300 h-17 transition-colors duration-300 flex items-center ${isScrolled ? "bg-[#141414]" : "bg-linear-to-b from-black/80 to-transparent"}`}>
            <div className="px-[4%] md:px-15 w-full flex items-center justify-between">

                {/* Left Side: Logo & Links */}
                <div className="flex items-center gap-10">
                    <Link to="/" className="text-cyan-500 font-black text-2xl md:text-3xl tracking-tighter uppercase">
                        Quadflix
                    </Link>

                    <ul className="hidden md:flex items-center gap-5 text-sm font-medium">
                        <li><Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-white font-bold' : 'text-zinc-300 hover:text-white'}`}>Home</Link></li>
                        <li><Link to="/tv" className={`transition-colors ${location.pathname === '/tv' ? 'text-white font-bold' : 'text-zinc-300 hover:text-white'}`}>Series</Link></li>
                        <li><Link to="/movies" className={`transition-colors ${location.pathname === '/movies' ? 'text-white font-bold' : 'text-zinc-300 hover:text-white'}`}>Movies</Link></li>
                        <li><Link to="/new-and-popular" className={`cursor-pointer transition-colors ${location.pathname === '/new-and-popular' ? 'text-white font-bold' : 'text-zinc-300 hover:text-white'}`}>New & Popular</Link></li>
                        <li><Link to="/my-list" className={`transition-colors ${location.pathname === '/my-list' ? 'text-white font-bold' : 'text-zinc-300 hover:text-white'}`}>My List</Link></li>
                    </ul>
                </div>

                {/* Right Side: Tools & Profile */}
                <div className="flex items-center gap-6 text-white">

                    {/* The Expanding Search Bar */}
                    <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'border border-white rounded-full bg-black/80 px-2 h-10 py-1' : 'border-transparent bg-transparent'}`}>
                        <Search
                            className={`w-5 h-5 cursor-pointer ${isSearchOpen ? 'text-white' : 'text-zinc-100 hover:text-zinc-300'} transition-colors`}
                            onClick={openSearch}
                        />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Titles, people, genres"
                            value={searchQuery}
                            onChange={handleSearchChange} // <--- Triggers instantly on type
                            onKeyDown={handleKeyDown}
                            className={`bg-transparent text-sm focus:outline-none transition-all duration-300 ease-in-out placeholder-zinc-400 ${isSearchOpen ? 'w-48 ml-2 opacity-100 visible' : 'w-0 opacity-0 invisible'}`}
                        />

                        {isSearchOpen && (
                            <X
                                className={`w-4 h-4 cursor-pointer transition-colors ${searchQuery.length > 0 ? 'text-white hover:text-zinc-300' : 'text-zinc-500 hover:text-white'}`}
                                onClick={clearOrCloseSearch}
                                title={searchQuery.length > 0 ? "Clear search" : "Close"}
                            />
                        )}
                    </div>

                    <Bell className="w-5 h-5 cursor-pointer hidden sm:block hover:text-zinc-300 transition-colors" />

                    {/* Profile Dropdown Trigger */}
                    <div className="relative group flex items-center cursor-pointer">
                        <img 
                            src={(user?.image || "/avatar1.svg").replace('.png', '.svg')} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-md object-cover border border-transparent group-hover:border-zinc-500 transition-all duration-300"
                        />
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-4 w-52 bg-black/95 border border-zinc-800 rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col pt-2 pb-2">
                            {/* Triangle pointer */}
                            <div className="absolute -top-2 right-2 w-4 h-4 bg-black/95 border-t border-l border-zinc-800 rotate-45"></div>
                            
                            {/* User Info */}
                            <div className="px-4 py-3 flex items-center gap-3 relative z-10 border-b border-zinc-800">
                                <img src={(user?.image || "/avatar1.svg").replace('.png', '.svg')} alt="Profile" className="w-9 h-9 rounded-md object-cover" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-semibold truncate text-white">{user?.username || 'User'}</span>
                                    <span className="text-xs text-zinc-400 truncate">{user?.email || ''}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <button 
                                onClick={logout} 
                                className="mt-2 px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 flex items-center gap-3 transition-colors relative z-10 w-full text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out of Quadflix
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;