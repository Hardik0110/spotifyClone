import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Spotify API credentials
const CLIENT_ID = 'f29485f82aba428f9f058c89fa168371'; // Replace with your actual Spotify Client ID
const REDIRECT_URI = 'https://localhost:5173/callback'; // Using HTTPS for Spotify auth

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        // Check for token in localStorage on mount
        const token = localStorage.getItem('access_token');
        if (token) {
            setAccessToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    const login = () => {
        const scope = 'streaming user-read-email user-read-private';
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setAccessToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 