import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Callback() {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (accessToken) {
            localStorage.setItem('access_token', accessToken);
            window.location.href = '/'; // Use window.location.href to force a full page reload
        } else {
            // If no token is found, redirect back to login
            login();
        }
    }, [login]);

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