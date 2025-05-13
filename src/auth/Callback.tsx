import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Callback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Get the code from the URL query parameters
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
            console.error('Error during authentication:', error);
            navigate('/login');
            return;
        }

        if (code) {
            // Store the code in localStorage
            localStorage.setItem('spotify_code', code);
            console.log('Authorization code received:', code);
            // Redirect to the main app
            navigate('/');
        } else {
            console.error('No code received');
            navigate('/login');
        }
    }, [navigate, location]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Processing login...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            </div>
        </div>
    );
}

export default Callback; 