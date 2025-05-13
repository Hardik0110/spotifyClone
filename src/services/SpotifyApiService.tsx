import React from 'react';
import { useAuth } from '../context/AuthContext';

function SpotifyApiService() {
    const { accessToken, refreshAccessToken } = useAuth();
    
    const getHeaders = async () => {
        // Check if we have an access token
        let token = accessToken;
        
        // If not, try to get a new one through the refresh mechanism
        if (!token) {
            token = await refreshAccessToken();
            if (!token) {
                throw new Error('No access token available');
            }
        }
        
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    };
    
    // Search for tracks
    const searchTracks = async (query: string, limit = 20) => {
        try {
            const headers = await getHeaders();
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
                { headers }
            );
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, try refreshing
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        return searchTracks(query, limit);
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                }
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.tracks.items.map((track: any) => ({
                id: track.id,
                name: track.name,
                artist: track.artists.map((artist: any) => artist.name).join(', '),
                album: track.album.name,
                image: track.album.images[0]?.url || '',
                uri: track.uri,
                duration_ms: track.duration_ms,
                preview_url: track.preview_url,
            }));
        } catch (error) {
            console.error('Error searching tracks:', error);
            throw error;
        }
    };
    
    // Get a track by ID
    const getTrack = async (trackId: string) => {
        try {
            const headers = await getHeaders();
            const response = await fetch(
                `https://api.spotify.com/v1/tracks/${trackId}`,
                { headers }
            );
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, try refreshing
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        return getTrack(trackId);
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                }
                throw new Error(`API error: ${response.status}`);
            }
            
            const track = await response.json();
            return {
                id: track.id,
                name: track.name,
                artist: track.artists.map((artist: any) => artist.name).join(', '),
                album: track.album.name,
                image: track.album.images[0]?.url || '',
                uri: track.uri,
                duration_ms: track.duration_ms,
                preview_url: track.preview_url,
            };
        } catch (error) {
            console.error('Error getting track:', error);
            throw error;
        }
    };
    
    // Control playback (requires appropriate scopes and active device)
    const playSong = async (uri: string) => {
        try {
            const headers = await getHeaders();
            const response = await fetch(
                'https://api.spotify.com/v1/me/player/play',
                {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({
                        uris: [uri],
                    }),
                }
            );
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, try refreshing
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        return playSong(uri);
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                }
                
                // No active device found
                if (response.status === 404) {
                    throw new Error('No active Spotify device found');
                }
                
                throw new Error(`API error: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error('Error playing song:', error);
            throw error;
        }
    };
    
    // Get current user profile
    const getCurrentUser = async () => {
        try {
            const headers = await getHeaders();
            const response = await fetch(
                'https://api.spotify.com/v1/me',
                { headers }
            );
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, try refreshing
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        return getCurrentUser();
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                }
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    };
    
    return {
        searchTracks,
        getTrack,
        playSong,
        getCurrentUser,
    };
}

// Create a hook to use the API service
export function useSpotifyApi() {
    return SpotifyApiService();
}

export default SpotifyApiService; 