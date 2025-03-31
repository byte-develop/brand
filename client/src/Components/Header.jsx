import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AuthService } from '../services/auth.service'
import { useAppDispatch } from '../store/hooks'
import { LogoutSlice } from '../store/user/userSlice'
import { removeTokenFromLocalStorage } from '../helpers/localstorage.helper'
import "./header.css"
import { useMediaQuery } from 'react-responsive';


const Header = () => {
    const isAuth = useAuth();
    const [data, setData] = useState({ login: '' });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [active, setActive] = useState("")
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    useEffect(() => {
        const path = location.pathname;

        const page = path.split('/').pop();

        if (page) {
            setActive(page);
        } else {
            setActive("home");
        }
    }, [location.pathname]);

    const checkData = async () => {
        const data = await AuthService.getMe();
        if (data) {
            setData(data);
        }
    };

    useEffect(() => {
        checkData();
    }, [isAuth]);

    const logoutHandler = () => {
        dispatch(LogoutSlice());
        removeTokenFromLocalStorage('token');
        window.location.reload()
    };

    const [isMenuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(prev => !prev);
    };

    const menuClick = (e) => {
        setActive(e)
        setMenuVisible(false);
    }

    const loginClick = () => {
        navigate(`/profile/${data.id}`)
        setMenuVisible(false);
    }


    return (
        <>
            {isMobile ?
                <>
                    <div id='menu' className={`absolute w-[100vw] h-[100vh] bg-black z-[250] ${isMenuVisible ? '' : 'hidden'}`}>
                        <div className='flex flex-col pl-[10%] gap-3 mt-20 text-[20px]'>
                            <Link to="/" onClick={() => menuClick("home")}>
                                <p className={active == "home" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Главная</p>
                            </Link>
                            <Link to="/catalog" onClick={() => menuClick("catalog")}>
                                <p className={active == "catalog" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Каталог</p>
                            </Link>
                            <Link to="/help" onClick={() => menuClick("help")}>
                                <p className={active == "help" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Помощь</p>
                            </Link>
                            <Link to="/games" onClick={() => menuClick("games")}>
                                <p className={active == "games" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Игры</p>
                            </Link>
                            <Link to="/work" onClick={() => menuClick("work")}>
                                <p className={active == "work" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Работа</p>
                            </Link>
                            <Link to="/sales" onClick={() => menuClick("sales")}>
                                <p className={active == "sales" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Акции</p>
                            </Link>
                        </div>
                        <div className="">
                            {isAuth ?

                                <div className="flex flex-col items-center justify-center mt-10">
                                    <button onClick={logoutHandler} className='w-32 h-10 rounded-xl' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>Выйти</button>
                                    <button className='mt-6' onClick={loginClick}>
                                        <p>{data ? data.login : 'Загрузка...'}</p>
                                    </button>

                                </div>

                                :


                                <div className="flex flex-col items-center mt-10">
                                    <Link onClick={toggleMenu} to="login">
                                        <button className='w-32 h-10 rounded-xl' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>Войти</button>
                                    </Link>
                                    <Link onClick={toggleMenu} className='mt-6' to="registration">
                                        <p>Регистрация</p>
                                    </Link>

                                </div>}
                        </div>
                    </div>
                    <div className='w-[100vw] h-[60px] px-[10vw] pt '>
                        <div className="flex items-center mt-3 justify-between">
                            <Link to={"/"} className='z-[251]'>
                                <img src="../public/logo.svg" alt="" className='h-[38px]' />
                            </Link>
                            <Link to={"/"} className='z-[251]'>
                                <p className='font-[OSB] text-[30px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>BRAND</p>
                            </Link>
                            <button className='z-[251]' onClick={toggleMenu}>
                                {isMenuVisible ?

                                    <>
                                        <img src="../close.svg" alt="" className='w-7' />
                                    </>

                                    :

                                    < >
                                        <div className="h-1 w-7 bg-[url('../public/burger.png')] bg-cover"></div>
                                        <div className="h-1 w-7 bg-[url('../public/burger.png')] bg-cover mt-1"></div>
                                        <div className="h-1 w-7 bg-[url('../public/burger.png')] bg-cover mt-1"></div>
                                    </>}
                            </button>
                        </div>
                    </div>
                </>

                :

                <div className='pt-10 flex items-center justify-between px-[15%] z-[5000]'>
                    <div className='flex items-center'>
                        <Link to="/">
                            <img src="../public/logo.svg" alt="" className='h-[64px] w-[67px]' />
                        </Link>
                        <div className='flex gap-8 pl-[30px] items-center'>
                            <Link to="/" onClick={() => setActive("home")}>
                                <p className={active == "home" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Главная</p>
                            </Link>
                            <Link to="/catalog" onClick={() => setActive("catalog")}>
                                <p className={active == "catalog" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Каталог</p>
                            </Link>
                            <Link to="/help" onClick={() => setActive("help")}>
                                <p className={active == "help" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Помощь</p>
                            </Link>
                            <Link to="/games" onClick={() => setActive("games")}>
                                <p className={active == "games" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Игры</p>
                            </Link>
                            <Link to="/work" onClick={() => setActive("work")}>
                                <p className={active == "work" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Работа</p>
                            </Link>
                            <Link to="/sales" onClick={() => setActive("sales")}>
                                <p className={active == "sales" ? "text-blue-800 transition-[.5s] underline" : "hover:text-blue-800 transition-[.5s]"}>Акции</p>
                            </Link>
                        </div>
                    </div>
                    {isAuth ?

                        <div className="flex items-center pl-[50px]">
                            <button onClick={() => navigate(`/profile/${data.id}`)}>
                                <p>{data ? data.login : 'Загрузка...'}</p>
                            </button>

                            <button onClick={logoutHandler} className='w-32 h-10 rounded-xl ml-8' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>Выйти</button>
                        </div>

                        :


                        <div className="flex items-center pl-[50px]">
                            <Link to="registration">
                                <p>Регистрация</p>
                            </Link>

                            <Link to="login" className='pl-8'>
                                <button className='w-32 h-10 rounded-xl' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>Войти</button>
                            </Link>
                        </div>}
                </div>
            }
        </>
    )
}

export default Header