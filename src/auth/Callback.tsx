import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Callback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Parse error parameters from URL if they exist
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get('error');
        const details = params.get('details');

        if (errorParam) {
            console.error('Authentication error:', errorParam);
            if (details) {
                try {
                    const errorDetails = JSON.parse(decodeURIComponent(details));
                    setError(`Error: ${errorParam}\nDetails: ${JSON.stringify(errorDetails, null, 2)}`);
                } catch (e) {
                    setError(`Error: ${errorParam}\nDetails: ${details}`);
                }
            } else {
                setError(`Error: ${errorParam}`);
            }
            setIsLoading(false);
            return;
        }

        // If we have access token in localStorage, we're authenticated
        const checkAuth = () => {
            const token = localStorage.getItem('access_token');
            
            if (token) {
                console.log('Access token found, redirecting to main app');
                setIsLoading(false);
                navigate('/', { replace: true });
                return true;
            }
            return false;
        };

        // Check immediately if we already have the token
        if (checkAuth()) {
            return;
        }

        // Set up a listener for the storage event (in case token is set in another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'access_token' && e.newValue) {
                checkAuth();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        // Set up a listener for our custom authentication event
        const handleTokenSet = (e: Event) => {
            const customEvent = e as CustomEvent<{ accessToken: string }>;
            if (customEvent.detail && customEvent.detail.accessToken) {
                checkAuth();
            }
        };
        window.addEventListener('spotify_authenticated', handleTokenSet);

        // Safety timeout - if we don't get authenticated within 10 seconds, show an error
        const timeout = setTimeout(() => {
            if (!localStorage.getItem('access_token')) {
                setError('Authentication timed out. Please try again.');
                setIsLoading(false);
            }
        }, 10000);

        // Clean up event listeners and timeout
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('spotify_authenticated', handleTokenSet);
            clearTimeout(timeout);
        };
    }, [navigate]);

    // If an error occurred, show it with a retry button
    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center max-w-2xl mx-auto p-8">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Authentication Error</h2>
                    <pre className="bg-gray-800 p-4 rounded-lg overflow-auto text-left text-sm">
                        {error}
                    </pre>
                    <button
                        onClick={login}
                        className="mt-8 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Show loading indicator while waiting for authentication to complete
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Completing Authentication...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">
                    Connecting to Spotify...
                </p>
            </div>
        </div>
    );
}

export default Callback;