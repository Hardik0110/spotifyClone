function Login() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <a 
                href="https://192.168.1.19:8888/login"
                className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
                Login with Spotify
            </a>
        </div>
    )
}

export default Login 