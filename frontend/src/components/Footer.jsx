import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  
  // Don't show Footer on watch or auth pages
  if (
    location.pathname.includes('/watch') ||
    location.pathname === '/login' || 
    location.pathname === '/signup'
  ) {
    return null;
  }

  return (
    <footer className="w-full bg-[#09090b] text-zinc-400 py-12 border-t border-zinc-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-10">
          
          {/* Brand & Description */}
          <div className="flex flex-col items-center md:items-start max-w-sm text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-widest text-white drop-shadow-md mb-4">
              QUAD<span className="text-cyan-500">FLIX</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Your ultimate destination for endless entertainment. Discover, watch, and enjoy the best movies and TV shows from around the globe.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-12 sm:gap-16 w-full md:w-auto">
            <div className="flex flex-col gap-3">
              <h3 className="text-white font-semibold mb-2">Company</h3>
              <Link to="#" className="text-sm hover:text-cyan-400 transition-colors">About Us</Link>
              <Link to="#" className="text-sm hover:text-cyan-400 transition-colors">Careers</Link>
              <Link to="#" className="text-sm hover:text-cyan-400 transition-colors">Contact</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-white font-semibold mb-2">Support</h3>
              <Link to="#" className="text-sm hover:text-cyan-400 transition-colors">Help Center</Link>
              <Link to="#" className="text-sm hover:text-cyan-400 transition-colors">Terms of Service</Link>
              <Link to="#" className="text-sm hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-zinc-800/50 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Quadflix. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-full bg-zinc-900 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="p-2 rounded-full bg-zinc-900 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="p-2 rounded-full bg-zinc-900 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="#" className="p-2 rounded-full bg-zinc-900 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;