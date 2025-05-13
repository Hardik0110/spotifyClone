import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SearchBar from './components/SearchBar';
import SongList from './components/SongList';
import SongDetails from './components/SongDetails';
import Player from './components/Player';
import Callback from './components/Callback';

interface Song {
    id: string;
    name: string;
    artist: string;
    image: string;
}

function AppContent() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | undefined>();
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
    const { isAuthenticated, login } = useAuth();

    const handleSearchResults = (results: Song[]) => {
        setSongs(results);
    };

    const handleSongSelect = (song: Song) => {
        const index = songs.findIndex(s => s.id === song.id);
        setCurrentSongIndex(index);
        setCurrentSong(song);
    };

    const handleNext = () => {
        if (currentSongIndex < songs.length - 1) {
            const nextSong = songs[currentSongIndex + 1];
            setCurrentSong(nextSong);
            setCurrentSongIndex(currentSongIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentSongIndex > 0) {
            const previousSong = songs[currentSongIndex - 1];
            setCurrentSong(previousSong);
            setCurrentSongIndex(currentSongIndex - 1);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-8">Welcome to Spotify Clone</h1>
                    <p className="text-gray-400 mb-8">Please login to continue</p>
                    <button
                        onClick={login}
                        className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                        Login with Spotify
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <SearchBar onSearchResults={handleSearchResults} />
                <Routes>
                    <Route
                        path="/"
                        element={<SongList songs={songs} onSongSelect={handleSongSelect} />}
                    />
                    <Route
                        path="/song/:id"
                        element={<SongDetails songs={songs} onSongSelect={handleSongSelect} />}
                    />
                </Routes>
            </div>
            <Player
                currentSong={currentSong}
                onNext={handleNext}
                onPrevious={handlePrevious}
            />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/callback" element={<Callback />} />
                    <Route path="/*" element={<AppContent />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
