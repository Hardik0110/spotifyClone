import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Song {
    id: string;
    name: string;
    artist: string;
    image: string;
    album?: string;
    duration_ms?: number;
    preview_url?: string;
}

interface SongListProps {
    songs: Song[];
    onSongSelect: (song: Song) => void;
}

function SongList({ songs, onSongSelect }: SongListProps) {
    const navigate = useNavigate();

    const handleSongClick = (song: Song) => {
        onSongSelect(song);
        navigate(`/song/${song.id}`);
    };

    if (songs.length === 0) {
        return (
            <div className="text-center text-gray-400 mt-8">
                <p>No songs found. Try searching for something!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {songs.map((song) => (
                <div
                    key={song.id}
                    onClick={() => handleSongClick(song)}
                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors"
                >
                    <div className="aspect-w-1 aspect-h-1">
                        <img
                            src={song.image}
                            alt={song.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-white font-medium truncate">{song.name}</h3>
                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                        {song.album && (
                            <p className="text-gray-500 text-sm truncate">{song.album}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SongList; 