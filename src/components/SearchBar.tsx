import React, { useState } from 'react';
import { useSpotifyApi } from '../services/SpotifyApiService';

interface Song {
    id: string;
    name: string;
    artist: string;
    image: string;
}

interface SearchBarProps {
    onSearchResults: (results: Song[]) => void;
}

function SearchBar({ onSearchResults }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const spotifyApi = useSpotifyApi();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const results = await spotifyApi.searchTracks(query);
            const tracks = results.map((track: any) => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                image: track.album.images[0]?.url || ''
            }));
            onSearchResults(tracks);
        } catch (error) {
            console.error('Search failed:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for songs..."
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </div>
        </form>
    );
}

export default SearchBar; 