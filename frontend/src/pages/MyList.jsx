import React from 'react';
import { useListStore } from '../store/listStore';
import MediaCard from '../components/MediaCard';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyList = () => {
    const { myList } = useListStore();

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-6 md:px-16 selection:bg-cyan-500 selection:text-black">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <h1 className="text-3xl font-black drop-shadow-md">My List</h1>
                    <span className="text-zinc-500 font-semibold">{myList.length} items</span>
                </div>

                {myList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center border border-zinc-800/50 rounded-2xl bg-zinc-900/30">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                            <Play className="w-8 h-8 text-zinc-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Your list is empty</h2>
                        <p className="text-zinc-500 mb-6 max-w-sm">
                            Add movies and TV shows to your list so you can easily find them later.
                        </p>
                        <Link 
                            to="/" 
                            className="bg-white hover:bg-zinc-200 text-black font-bold px-6 py-2.5 rounded-lg transition-colors"
                        >
                            Explore Content
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {myList.map((item) => {
                            if (!item) return null;
                            return (
                                <div key={item.id} className="relative aspect-[2/3] group">
                                    <MediaCard media={item} mediaType={item.media_type || "movie"} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyList;