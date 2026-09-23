import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import HomePage from './pages/home/HomePage';
import Navbar from './components/Navbar'; 
import DetailsPage from './pages/DetailsPage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';
import Footer from './components/Footer';
import { useAuthStore } from './store/authUser';
import { useListStore } from './store/listStore';
import NewAndPopular from './pages/NewAndPopular';
import MyList from './pages/MyList';
import { Loader2 } from 'lucide-react';

function App() {
    const { user, isCheckingAuth, checkAuth } = useAuthStore();
    const { fetchList } = useListStore();
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (user) {
            fetchList();
        }
    }, [user, fetchList]);

    if (isCheckingAuth) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-white">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
            </div>
        );
    }

    const isWatchPage = pathname.startsWith('/watch');

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col">
            {/* Only render the Navbar if a user is authenticated */}
            {!isWatchPage && user && <Navbar />}

            <main className="grow">
                <Routes>
                    <Route path="/" element={user ? <HomePage type="all" /> : <Navigate to="/login" />} />
                    <Route path="/tv" element={user ? <HomePage type="tv" /> : <Navigate to="/login" />} />
                    <Route path="/movies" element={user ? <HomePage type="movie" /> : <Navigate to="/login" />} />
                    <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
                    <Route path="/details/:type/:id" element={user ? <DetailsPage /> : <Navigate to="/login" />} />
                    <Route path="/watch/:type/:id" element={user ? <WatchPage /> : <Navigate to="/login" />} />
                    <Route path="/search" element={user ? <SearchPage /> : <Navigate to="/login" />} />
                    <Route path="/my-list" element={user ? <MyList /> : <Navigate to="/login" />} />
                    <Route path="/new-and-popular" element={user ? <NewAndPopular /> : <Navigate to="/login" />} />
                </Routes>
            </main>

            {!isWatchPage && user && <Footer />}
        </div>
    );
}

export default App;