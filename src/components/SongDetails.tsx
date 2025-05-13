import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Song {
    id: string;
    name: string;
    artist: string;
    image: string;
}

interface SongDetailsProps {
    songs: Song[];
    onSongSelect: (song: Song) => void;
}

function SongDetails({ songs, onSongSelect }: SongDetailsProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const song = songs.find(s => s.id === id);

    if (!song) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-400">Song not found</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    Back to Search
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/')}
                className="mb-8 text-gray-400 hover:text-white flex items-center"
            >
                <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Search
            </button>
            <div className="bg-gray-800 rounded-lg p-8">
                <div className="aspect-square mb-8">
                    <img
                        src={song.image}
                        alt={song.name}
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{song.name}</h1>
                <p className="text-xl text-gray-400 mb-8">{song.artist}</p>
                <button
                    onClick={() => onSongSelect(song)}
                    className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                    <svg
                        className="w-6 h-6 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    Play Now
                </button>
            </div>
        </div>
    );
}

export default SongDetails; 