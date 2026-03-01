import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const LoggedLandingPage = ({ user, setIsLogged, setUser }) => {
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!user) {
    //         setIsLogged(false);
    //         setUser(null);
    //         localStorage.removeItem('token');
    //         navigate('/login', { replace: true });
    //     }
    // }, [user]);

    // if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20 flex items-center justify-center">
            <div className="max-w-5xl mx-auto px-6 py-16">
                {/* Welcome */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">{'user.name' || 'Farmer'}</span>
                    </h1>
                    <p className="text-gray-500 text-lg mt-3">What would you like to do today?</p>
                    <Link to="/dashboard" className="inline-block mt-6 bg-[#2E7D32] text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg shadow-green-500/25 hover:bg-green-700 hover:shadow-green-500/40 transition-all duration-300">
                        Start Planning
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default LoggedLandingPage
