import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/navbar'
import DashBoard from './Components/DashBoard'
import LandingPage from './Components/LandingPage'
import Login from './Components/Login'
import SignUp from './Components/SignUp'
import Footer from './Components/Footer'
import useAuth from './hooks/useAuth'
import { useEffect } from 'react'
import api from './utils/api'
import LoggedLandingPage from './Components/LoggedLandingPage'

const App = () => {
  const { userLogged, logout, user, setUser } = useAuth();
  const [isLogged, setIsLogged] = React.useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLogged(false);
        return;
      }
      try {
        const response = await api.get('/me');
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setIsLogged(true);
        } else {
          setIsLogged(false);
        }
      } catch (error) {
        setIsLogged(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className='w-full min-h-screen bg-gray-600 flex flex-col text-black'>
      <Navbar isLogged={isLogged} user={user} logout={logout} />
      <Routes>
        <Route path='/' element={isLogged ? <LoggedLandingPage user={user} setIsLogged={setIsLogged} setUser={setUser}/> : <LandingPage />} />
        <Route path='/dashboard' element={<DashBoard isLogged = {isLogged} user={user} />} />
        <Route path='/login' element={<Login isLogged = {isLogged} user={user}/>} />
        <Route path='/signup' element={<SignUp isLogged = {isLogged} user={user}/>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
