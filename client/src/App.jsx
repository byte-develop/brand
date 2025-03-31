import './App.css'
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'
import { getTokenFromLocalStorage } from './helpers/localstorage.helper'
import { AuthService } from './services/auth.service'
import { useDispatch } from 'react-redux'
import { LoginSlice, LogoutSlice } from './store/user/userSlice'
import { useEffect, useState } from 'react'
import Header from './Components/Header'
import Home from './Pages/Home'
import Catalog from './Pages/Catalog'
import Login from './Pages/Login'
import Registration from './Pages/Registration'
import ErrorPage from './Pages/ErrorPage'
import ShopDetail from './Pages/ShopDetail'
import Help from './Pages/Help'
import Work from './Pages/Work'
import Profile from "./Pages/Profile"
import Preloader from './Pages/Preloader'
import Games from './Pages/Games'
import FreeCase from './Pages/FreeCase'
import RareCase from './Pages/RareCase'
import GeneralCase from './Pages/GeneralCase'
import LegendaryCase from './Pages/LegendaryCase'
import Event from './Pages/Event'
import EventCase from './Pages/EventCase'
import Sales from './Pages/Sales'
import Roulette from './Pages/Roulette'
import Miner from './Pages/Miner'
import Crash from './Pages/Crash'
import Statistic from './Pages/Statistic'
import { trackPageView } from './api';

function App() {

  const dispatch = useDispatch()

  const checkAuth = async () => {
    const token = getTokenFromLocalStorage()
    try {
      if (token) {
        const data = await AuthService.getMe()

        if (data) {
          dispatch(LoginSlice(data))
          return data
        } else {
          dispatch(LogoutSlice())
        }
      }
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      alert(errorMessage.toString());
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    handleStart();
    const timer = setTimeout(handleComplete, 2500);

    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <div className="font-[OR]">
      <Header />
      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <Preloader />
        </div>
      ) : (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/catalog' element={<Catalog />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/help' element={<Help />} />
          <Route path='/work' element={<Work />} />
          <Route path='/shop/:id' element={<ShopDetail />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/games' element={<Games />} />
          <Route path='/sales' element={<Sales />} />
          <Route path='/case/free' element={<FreeCase />} />
          <Route path='/case/general' element={<GeneralCase />} />
          <Route path='/case/legendary' element={<LegendaryCase />} />
          <Route path='/case/rare' element={<RareCase />} />
          <Route path='/roulette' element={<Roulette />} />
          <Route path='/miner' element={<Miner />} />
          <Route path='/statistic' element={<Statistic />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      )}
    </div>
  );
};
export default App
