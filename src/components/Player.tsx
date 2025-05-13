import React, { useState, useEffect } from 'react';
import { useSpotifyApi } from '../services/SpotifyApiService';

interface Song {
    id: string;
    name: string;
    artist: string;
    image: string;
    uri: string;
}

interface PlayerProps {
    currentSong: Song;
    onNext: () => void;
    onPrevious: () => void;
}

function Player({ currentSong, onNext, onPrevious }: PlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const spotifyApi = useSpotifyApi();

    const handlePlayPause = async () => {
        if (!currentSong?.uri) return;

        try {
            setError(null);
            await spotifyApi.playSong(currentSong.uri);
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing song:', error);
            setError(error instanceof Error ? error.message : 'Failed to play song');
            setIsPlaying(false);
        }
    };

    // Show error message if there is one
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
            {error && (
                <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-1">
                    {error}
                </div>
            )}
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        src={currentSong.image}
                        alt={currentSong.name}
                        className="w-16 h-16 rounded"
                    />
                    <div>
                        <h3 className="text-white font-medium">{currentSong.name}</h3>
                        <p className="text-gray-400 text-sm">{currentSong.artist}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onPrevious}
                        className="text-white hover:text-green-500 transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handlePlayPause}
                        className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                    >
                        {isPlaying ? (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={onNext}
                        className="text-white hover:text-green-500 transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Player; 