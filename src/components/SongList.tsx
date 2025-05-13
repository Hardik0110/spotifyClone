import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Song {
    id: string;
    name: string;
    artist: string;
    image: string;
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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
                <div
                    key={song.id}
                    onClick={() => handleSongClick(song)}
                    className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                >
                    <div className="aspect-square mb-4">
                        <img
                            src={song.image}
                            alt={song.name}
                            className="w-full h-full object-cover rounded"
                        />
                    </div>
                    <h3 className="text-white font-medium truncate">{song.name}</h3>
                    <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                </div>
            ))}
        </div>
    );
}

export default SongList; 