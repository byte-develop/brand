import React, { useState } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom'
import { AuthService } from '../services/auth.service'
import { setTokenToLocalStorage } from '../helpers/localstorage.helper'
import { useAppDispatch } from '../store/hooks'
import { LoginSlice } from '../store/user/userSlice'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'react-responsive'
import { useAuth } from '../hooks/useAuth'


const Login = () => {

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const isAuth = useAuth();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const loginHandler = async (e) => {
        try {
            e.preventDefault()
            const data = await AuthService.login({ login, password })

            if (data) {
                setTokenToLocalStorage('token', data.token)
                dispatch(LoginSlice(data))
                window.location.replace("/");
            }
        } catch (err) {
            const errorMessage = String(err.response ? err.response.data.message : err.message);
            toast.error(errorMessage);
        }
    }

    const Auth = () => {
        navigate('/');
    }

    return (
        <>
            {isAuth ?

                Auth()

                :

                <>
                    {isMobile ?

                        <div className='relative flex justify-center mt-16 h-[70vh] w-[100vw] items-center bg-[url(../public/LoginBG2.png)] bg-cover bg-no-repeat bg-center '>
                            <div className="relative flex items-center flex-col w-[90vw] h-[456px] border-gray-400 rounded-[50px] border-[5px]" style={{ background: "linear-gradient(0deg, rgba(0,0,0,1) 10%, rgba(0,61,217, 1) 50%, rgba(0,0,0,1) 90%)" }}>
                                <img src="/public/logo2.svg" alt="" className='h-36 translate-y-[-50%]' />
                                <div className="flex flex-col items-center translate-y-[-25%] relative w-full">
                                    <p className='font-[OSB] text-[20px] mt-7'>Добро пожаловать в Brand!</p>
                                    <p className='text-center mt-4'>
                                        Введите свои данные, введенные при
                                    </p>
                                    <span className='text-center'>регистрации, чтобы войти на сайт</span>
                                    <form className='relative flex flex-col w-4/5 mt-6 items-center' onSubmit={loginHandler}>
                                        <input value={login} onChange={(e) => setLogin(e.target.value)} type="text" className='input bg-[#D9D9D9] h-[35px] rounded-xl pl-4 text-black w-full' name="" id="login" placeholder='Логин' />
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='input bg-[#D9D9D9] h-[35px] rounded-xl mt-7 pl-4 text-black w-full' name="" id="password" placeholder='Пароль' />
                                        <div className="relative flex flex-col w-full items-center">
                                            <Link to="/" className='text-[#1949C4] mt-4 right-0 absolute'>забыли пароль?</Link>
                                            <button type='submit' className='mt-14 w-32 h-9 rounded-xl' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>Войти</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        :
                        <div className='relative flex justify-center mt-32 h-[80vh] w-[100vw] bg-[url(../public/LoginBG.png)] bg-cover bg-no-repeat bg-top'>
                            <div className="relative flex items-center flex-col w-[588px] h-[456px] border-gray-400 rounded-[50px] border-[5px]" style={{ background: "linear-gradient(0deg, rgba(0,0,0,1) 10%, rgba(0,61,217, 1) 50%, rgba(0,0,0,1) 90%)" }}>
                                <img src="/public/logo2.svg" alt="" className='h-36 translate-y-[-50%]' />
                                <div className="flex flex-col items-center translate-y-[-25%] relative w-full">
                                    <p className='font-[OSB] text-[20px] mt-7'>Добро пожаловать в Brand!</p>
                                    <p className='text-center mt-4'>
                                        Введите свои данные, введенные при
                                    </p>
                                    <span className='text-center'>регистрации, чтобы войти на сайт</span>
                                    <form className='relative flex flex-col w-4/5 mt-6 items-center' onSubmit={loginHandler}>
                                        <input value={login} onChange={(e) => setLogin(e.target.value)} type="text" className='input bg-[#D9D9D9] h-[35px] rounded-xl pl-4 text-black w-full' name="" id="login" placeholder='Логин' />
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='input bg-[#D9D9D9] h-[35px] rounded-xl mt-7 pl-4 text-black w-full' name="" id="password" placeholder='Пароль' />
                                        <div className="relative flex flex-col w-full items-center">
                                            <Link to="/" className='text-[#1949C4] mt-4 right-0 absolute'>забыли пароль?</Link>
                                            <button type='submit' className='mt-14 w-32 h-9 rounded-xl' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>Войти</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    }
                </>

            }
        </>

    )
}

export default Login