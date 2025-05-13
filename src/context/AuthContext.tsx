import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    login: () => void;
    logout: () => void;
    refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Server URL
const SERVER_URL = 'https://192.168.1.19:8888';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<number | null>(null);

    useEffect(() => {
        // Check for token in localStorage on mount
        const token = localStorage.getItem('access_token');
        const refresh = localStorage.getItem('refresh_token');
        const expires = localStorage.getItem('expires_in');
        const tokenTimestamp = localStorage.getItem('token_timestamp');
        
        if (token) {
            setAccessToken(token);
            setIsAuthenticated(true);
            
            if (refresh) {
                setRefreshToken(refresh);
            }
            
            if (expires && tokenTimestamp) {
                const expiryTime = parseInt(tokenTimestamp) + parseInt(expires) * 1000;
                setExpiresAt(expiryTime);
                
                // Set up a refresh timer if token is close to expiration
                const now = Date.now();
                if (expiryTime > now) {
                    const timeUntilRefresh = expiryTime - now - 60000; // Refresh 1 minute before expiry
                    setTimeout(() => refreshAccessToken(), timeUntilRefresh);
                } else {
                    // Token already expired, refresh immediately
                    refreshAccessToken();
                }
            }
        }
        
        // Add event listener for storage changes
        window.addEventListener('storage', handleStorageChange);
        
        // Clean up event listener
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'access_token') {
            if (e.newValue) {
                setAccessToken(e.newValue);
                setIsAuthenticated(true);
            } else {
                setAccessToken(null);
                setIsAuthenticated(false);
            }
        } else if (e.key === 'refresh_token' && e.newValue) {
            setRefreshToken(e.newValue);
        }
    };

    const login = () => {
        // Redirect to the server's login endpoint
        window.location.href = `${SERVER_URL}/login`;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('token_timestamp');
        localStorage.removeItem('token_type');
        
        setAccessToken(null);
        setRefreshToken(null);
        setExpiresAt(null);
        setIsAuthenticated(false);
    };

    const refreshAccessToken = async (): Promise<string | null> => {
        const refresh = localStorage.getItem('refresh_token');
        
        if (!refresh) {
            console.error('No refresh token available');
            logout();
            return null;
        }
        
        try {
            const response = await fetch(`${SERVER_URL}/refresh_token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refresh }),
            });
            
            const data = await response.json();
            
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('token_timestamp', Date.now().toString());
                
                if (data.refresh_token) {
                    localStorage.setItem('refresh_token', data.refresh_token);
                    setRefreshToken(data.refresh_token);
                }
                
                if (data.expires_in) {
                    localStorage.setItem('expires_in', data.expires_in.toString());
                    const newExpiryTime = Date.now() + data.expires_in * 1000;
                    setExpiresAt(newExpiryTime);
                    
                    // Set up next refresh
                    const timeUntilRefresh = data.expires_in * 1000 - 60000; // Refresh 1 minute before expiry
                    setTimeout(() => refreshAccessToken(), timeUntilRefresh);
                }
                
                setAccessToken(data.access_token);
                setIsAuthenticated(true);
                return data.access_token;
            } else {
                console.error('Token refresh failed:', data);
                logout();
                return null;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
            return null;
        }
    };
    
    // Set up listeners for the custom authentication event
    useEffect(() => {
        const handleAuthentication = (event: Event) => {
            const customEvent = event as CustomEvent<{ accessToken: string }>;
            if (customEvent.detail && customEvent.detail.accessToken) {
                setAccessToken(customEvent.detail.accessToken);
                setIsAuthenticated(true);
                
                // Save token timestamp
                localStorage.setItem('token_timestamp', Date.now().toString());
                
                const refresh = localStorage.getItem('refresh_token');
                if (refresh) {
                    setRefreshToken(refresh);
                }
                
                const expires = localStorage.getItem('expires_in');
                if (expires) {
                    const expiryTime = Date.now() + parseInt(expires) * 1000;
                    setExpiresAt(expiryTime);
                    
                    // Set up refresh timer
                    const timeUntilRefresh = parseInt(expires) * 1000 - 60000; // Refresh 1 minute before expiry
                    setTimeout(() => refreshAccessToken(), timeUntilRefresh);
                }
            }
        };
        
        window.addEventListener('spotify_authenticated', handleAuthentication);
        
        return () => {
            window.removeEventListener('spotify_authenticated', handleAuthentication);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            accessToken, 
            refreshToken,
            login, 
            logout,
            refreshAccessToken
        }}>
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