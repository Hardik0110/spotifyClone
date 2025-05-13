import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    const { isAuthenticated, accessToken, login } = useAuth();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        if (!isAuthenticated) {
            login();
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    login();
                    return;
                }
                throw new Error('Search failed');
            }

            const data = await response.json();
            const tracks = data.tracks.items.map((track: any) => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                image: track.album.images[0]?.url || ''
            }));

            onSearchResults(tracks);
        } catch (error) {
            console.error('Error searching tracks:', error);
        }
    };

    return (
        <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isAuthenticated ? "Search for songs..." : "Login to search songs..."}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>
        </form>
    );
}

export default SearchBar; 