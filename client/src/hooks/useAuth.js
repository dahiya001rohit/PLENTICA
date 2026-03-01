import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const[userLogged, setUserLogged] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser(JSON.parse(atob(token.split('.')[1]))); // Decode token to get user info
            setUserLogged(true);
        } else {
            setUserLogged(false);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUserLogged(false);
        navigate('/login', { replace: true });
    };

    return { userLogged, logout, user, setUser };
}

export default useAuth;