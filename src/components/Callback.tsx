import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Callback() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        const details = params.get('details');

        if (error) {
            console.error('Authentication error:', error);
            if (details) {
                try {
                    const errorDetails = JSON.parse(decodeURIComponent(details));
                    setError(`Error: ${error}\nDetails: ${JSON.stringify(errorDetails, null, 2)}`);
                } catch (e) {
                    setError(`Error: ${error}\nDetails: ${details}`);
                }
            } else {
                setError(`Error: ${error}`);
            }
            return;
        }

        if (code) {
            // The server will handle the code exchange and redirect back to the app
            // We just need to wait for the token to be set in localStorage
            const checkToken = setInterval(() => {
                const token = localStorage.getItem('access_token');
                if (token) {
                    clearInterval(checkToken);
                    navigate('/', { replace: true });
                }
            }, 100);

            // Clear interval after 10 seconds if no token is received
            setTimeout(() => {
                clearInterval(checkToken);
                setError('Authentication timed out. Please try again.');
            }, 10000);
        } else {
            setError('No authorization code received. Please try again.');
        }
    }, [navigate, login]);

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

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Completing Authentication...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            </div>
        </div>
    );
}

export default Callback; 