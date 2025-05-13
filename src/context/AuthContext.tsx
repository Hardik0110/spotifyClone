import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Server URL
const SERVER_URL = 'https://192.168.1.19:8888';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        // Check for token in localStorage on mount and when storage changes
        const checkAuth = () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                setAccessToken(token);
                setIsAuthenticated(true);
            } else {
                setAccessToken(null);
                setIsAuthenticated(false);
            }
        };

        // Initial check
        checkAuth();

        // Listen for storage changes
        window.addEventListener('storage', checkAuth);

        // Custom event listener for when token is set by the callback page
        const handleTokenSet = () => {
            checkAuth();
        };
        window.addEventListener('tokenSet', handleTokenSet);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('tokenSet', handleTokenSet);
        };
    }, []);

    const login = () => {
        window.location.href = `${SERVER_URL}/login`;
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