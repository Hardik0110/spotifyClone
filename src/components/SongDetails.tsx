import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSpotifyApi } from '../services/SpotifyApiService';

interface Song {
    id: string;
    name: string;
    artist: string;
    image: string;
    album?: string;
    duration_ms?: number;
    preview_url?: string;
}

interface SongDetailsProps {
    songs: Song[];
    onSongSelect: (song: Song) => void;
}

function SongDetails({ songs, onSongSelect }: SongDetailsProps) {
    const { id } = useParams<{ id: string }>();
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const spotifyApi = useSpotifyApi();

    useEffect(() => {
        const fetchSongDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                // First check if we have the song in our list
                const existingSong = songs.find(s => s.id === id);
                if (existingSong) {
                    setSong(existingSong);
                    return;
                }

                // If not, fetch it from the API
                const songDetails = await spotifyApi.getTrack(id);
                setSong(songDetails);
            } catch (error) {
                console.error('Error fetching song details:', error);
                setError(error instanceof Error ? error.message : 'Failed to load song details');
            } finally {
                setLoading(false);
            }
        };

        fetchSongDetails();
    }, [id, songs, spotifyApi]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 mt-8">
                <p>{error}</p>
            </div>
        );
    }

    if (!song) {
        return (
            <div className="text-center text-gray-400 mt-8">
                <p>Song not found</p>
            </div>
        );
    }

    const formatDuration = (ms: number | undefined) => {
        if (!ms) return '';
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <img
                            src={song.image}
                            alt={song.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-8 md:w-1/2">
                        <h1 className="text-3xl font-bold text-white mb-2">{song.name}</h1>
                        <p className="text-gray-400 text-lg mb-4">{song.artist}</p>
                        {song.album && (
                            <p className="text-gray-500 mb-4">Album: {song.album}</p>
                        )}
                        {song.duration_ms && (
                            <p className="text-gray-500 mb-4">
                                Duration: {formatDuration(song.duration_ms)}
                            </p>
                        )}
                        <button
                            onClick={() => onSongSelect(song)}
                            className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        >
                            Play
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SongDetails; 