import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMediaQuery } from 'react-responsive';
import { useAppDispatch } from '../store/hooks';
import { AuthService } from '../services/auth.service';
import { toast } from 'react-toastify';
import { setTokenToLocalStorage } from '../helpers/localstorage.helper';
import { LoginSlice } from '../store/user/userSlice';

const LoginModal = ({ onClose }) => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [reg, setReg] = useState(false)

    const isAuth = useAuth();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const loginHandler = async (e) => {
        try {
            e.preventDefault()
            const data = await AuthService.login({ login, password })

            if (data) {
                setTokenToLocalStorage('token', data.token)
                dispatch(LoginSlice(data))
                window.location.reload();
            }
        } catch (err) {
            const errorMessage = String(err.response ? err.response.data.message : err.message);
            toast.error(errorMessage);
        }
    }

    const [email, setEmail] = useState('')
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [captchaQuestion, setCaptchaQuestion] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        const operation = Math.random() < 0.5 ? '+' : '-';
        let question;

        if (operation === '+') {
            question = `${num1} + ${num2}`;
            setCorrectAnswer(num1 + num2);
        } else {
            question = `${num1} - ${num2}`;
            setCorrectAnswer(num1 - num2);
        }

        setCaptchaQuestion(question);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptedTerms) {
            toast.error('Пожалуйста, примите правила сайта.');
            return;
        }

        if (login.length > 32) {
            toast.error('Максимальная допустимая длина логина 32 символа.');
            return;
        }

        if (parseInt(captchaAnswer) !== correctAnswer) {
            toast.error('Неверный ответ на капчу. Пожалуйста, попробуйте снова.');
            generateCaptcha();
            return;
        }

        try {
            setIsLoading(true);
            if (email) {
                const data = await AuthService.registration({ email, login, password });
            } else {
                const data = await AuthService.registration({ login, password });
            }
            toast.success('Аккаунт успешно создан!')
            setReg(false)
        } catch (err) {
            const errorMessage = err.response ? err.response.data.message : err.message;
            toast.error(errorMessage.toString());
        } finally {
            setIsLoading(false);
        }

    };

    document.addEventListener('mousemove', parallax)
    function parallax(e) {
        document.querySelectorAll('.obj').forEach(function (move) {
            var moving_value = move.getAttribute('data-value');
            var x = (e.clientX * moving_value) / 250;
            var y = (e.clientY * moving_value) / 250;

            move.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)'
        })
    }

    return (
        <>
            {
                isMobile ?

                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[10000000]">
                        <div className="flex items-center justify-center w-[90vw] h-[60vh] min-h-[600px] rounded-[40px] bg-[#000A21] p-5 relative">
                            <img src="../public/tr.png" alt="" className='absolute top-[10%] right-0'/>
                            <img src="../public/br.png" alt="" className='absolute bottom-0 right-0'/>
                            <img src="../public/tl.png" alt="" className='absolute top-0 left-0 rounded-l-[40px]'/>
                            <img src="../public/bl.png" alt="" className='absolute bottom-0 left-0 rounded-l-[40px]'/>


                            {!reg ?

                                <div className="p-x-[19px] p-y-[16px] h-full w-full bg-[#0F182E] rounded-[40px]">
                                    <form className='flex flex-col items-center mt-10 justify-center' onSubmit={loginHandler}>
                                        <p className='text-[20px] font-[OEB] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>АВТОРИЗАЦИЯ</p>
                                        <p style={{ whiteSpace: "normal" }} className='text-[14px] mt-2 text-center w-[80%]'>Чтобы продолжить играть, вам нужно войти в свой аккаунт.</p>
                                        <input value={login} onChange={(e) => setLogin(e.target.value)} type="text" className=' mt-5 input bg-[#D9D9D9] h-[30px] rounded-xl text-black w-[90%] pl-4' name="" id="login" placeholder='Логин' />
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='mt-6 pl-4 input bg-[#D9D9D9] h-[30px] rounded-xl text-black w-[90%]' name="" id="password" placeholder='Пароль' />
                                        <div className="relative flex flex-col w-full items-center">
                                            <button type='submit' className='w-[30%] mt-10 h-9 rounded-xl' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>Войти</button>
                                        </div>
                                        <div className="flex gap-3 text-[14px] mt-6">
                                            <div className="">{reg ? "Уже есть аккаунт?" : "Ещё нет аккаунта?"}</div>
                                            <button onClick={() => setReg(!reg)} className='text-[#1949C4]'>{reg ? "Войдите в систему" : "Зарегистрируйтесь"}</button>
                                        </div>
                                    </form>
                                </div>

                                :
                                <div className="p-x-[19px] p-y-[16px] h-full w-full bg-[#0F182E] rounded-[40px]">
                                    <form className='flex flex-col items-center justify-center mt-5' onSubmit={handleSubmit}>
                                        <p className='text-[20px] font-[OEB] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>РЕГИСТРАЦИЯ</p>
                                        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="text" className='mt-8 input bg-[#D9D9D9] h-[30px] rounded-xl pl-4 text-black w-[90%]' name="" placeholder='E-mail (необязательно)' />
                                        <input id="login" value={login} onChange={(e) => setLogin(e.target.value)} type="text" className='input bg-[#D9D9D9] h-[30px] rounded-xl mt-7 pl-4 text-black w-[90%]' name="" placeholder='Логин' required />
                                        <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='input bg-[#D9D9D9] h-[30px] rounded-xl mt-7 pl-4 text-black w-[90%]' name="" placeholder='Пароль' required />


                                        <label className="flex items-center justify-start mt-5 z-10 ml-5 w-[90%]">
                                            <input
                                                type="checkbox"
                                                checked={acceptedTerms}
                                                onChange={() => setAcceptedTerms(!acceptedTerms)}
                                            />
                                            <span className="ml-2" style={{ whiteSpace: "normal" }}>Регистрируясь, я принимаю правила сайта</span>
                                        </label>

                                        <div className="mt-3 w-full p-4 flex items-center justify-between">
                                            <div className='w-[150px] h-[35px] flex items-center justify-center font-[OB] bg-[url(../public/captha.png)] bg-center rounded-lg' style={{ color: 'blue', fontSize: '18px' }}>{captchaQuestion}</div>
                                            <input
                                                type="text"
                                                value={captchaAnswer}
                                                onChange={(e) => setCaptchaAnswer(e.target.value)}
                                                placeholder='Введите ответ'
                                                className='input bg-[#D9D9D9] h-[35px] rounded-xl pl-4 ml-3 text-black w-full text-[14px]'
                                                required
                                            />
                                        </div>

                                        <div className="relative flex flex-col w-full items-center">
                                            <button type='submit' disabled={isLoading} className='mt-5 w-56 h-9 rounded-xl' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>
                                                {isLoading ?

                                                    <div className='flex items-center justify-center'>
                                                        <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                            <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                        </svg>
                                                        Загрузка...
                                                    </div>

                                                    :

                                                    'Зарегистрироваться'

                                                }
                                            </button>
                                        </div>
                                        <div className="flex gap-3 text-[14px] mt-6">
                                            <div className="">{reg ? "Уже есть аккаунт?" : "Ещё нет аккаунта?"}</div>
                                            <button onClick={() => setReg(!reg)} className='text-[#1949C4]'>{reg ? "Войдите в систему" : "Зарегистрируйтесь"}</button>
                                        </div>
                                    </form>
                                </div>


                            }
                        </div>
                    </div>

                    :

                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                        <div className="flex w-[50vw] h-[60vh] rounded-[40px] bg-[#000A21] p-5 relative">
                            <div className="absolute right-8 top-5 flex gap-3">
                                <div className="">{reg ? "Уже есть аккаунт?" : "Ещё нет аккаунта?"}</div>
                                <button onClick={() => setReg(!reg)} className='text-[#1949C4]'>{reg ? "Войдите в систему" : "Зарегистрируйтесь"}</button>
                            </div>
                            <div className="w-[45%] bg-[url('../public/GameModalBG.png')] h-full bg-center bg-cover rounded-3xl relative overflow-hidden">
                                <img src="../public/coin1.png" className='absolute top-[15%] left-[50%] obj' data-value={'3'} alt="" />
                                <img src="../public/coin2.png" className='absolute top-[30%] right-0 obj' data-value={'-1'} alt="" />
                                <img src="../public/gamepad1.png" className='absolute top-[25%] left-0 obj' data-value={'2'} alt="" />
                                <img src="../public/gamepad2.png" className='absolute top-[55%] right-[5%] obj' data-value={'-4'} alt="" />
                                <img src="../public/coin3.png" className='absolute top-[65%] left-[10%] obj' data-value={'3'} alt="" />
                                <img src="../public/coin4.png" className='absolute bottom-0 left-0' alt="" />



                            </div>
                            {!reg ?

                                <form className='flex flex-col w-[55%] items-center pl-8 mt-[10vh]' onSubmit={loginHandler}>
                                    <p className='text-left w-full text-[40px] font-[OEB] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>АВТОРИЗАЦИЯ</p>
                                    <p style={{ whiteSpace: "normal" }} className='text-[18px] mt-8'>Чтобы продолжить играть, вам нужно войти
                                        в свой аккаунт. Для этого заполните данные, введенные при регистрации.</p>
                                    <input value={login} onChange={(e) => setLogin(e.target.value)} type="text" className=' mt-8 input bg-[#D9D9D9] h-[35px] rounded-xl text-black w-full pl-4' name="" id="login" placeholder='Логин' />
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='mt-8 pl-4 input bg-[#D9D9D9] h-[35px] rounded-xl text-black w-full' name="" id="password" placeholder='Пароль' />
                                    <div className="relative flex flex-col w-full items-center">
                                        <button type='submit' className='w-[30%] mt-12 h-9 rounded-xl' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>Войти</button>
                                    </div>
                                </form>

                                :

                                <form className='flex flex-col w-[55%] items-center pl-8 mt-[10vh]' onSubmit={handleSubmit}>
                                    <p className='text-left w-full text-[40px] font-[OEB] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>РЕГИСТРАЦИЯ</p>
                                    <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="text" className='mt-8 input bg-[#D9D9D9] h-[35px] rounded-xl pl-4 text-black w-full' name="" placeholder='E-mail (необязательно)' />
                                    <input id="login" value={login} onChange={(e) => setLogin(e.target.value)} type="text" className='input bg-[#D9D9D9] h-[35px] rounded-xl mt-7 pl-4 text-black w-full' name="" placeholder='Логин' required />
                                    <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='input bg-[#D9D9D9] h-[35px] rounded-xl mt-7 pl-4 text-black w-full' name="" placeholder='Пароль' required />


                                    <label className="flex items-center justify-start w-full mt-5 z-10 ml-5">
                                        <input
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            onChange={() => setAcceptedTerms(!acceptedTerms)}
                                        />
                                        <span className="ml-2" style={{ whiteSpace: "normal" }}>Регистрируясь, я принимаю правила сайта</span>
                                    </label>

                                    <div className="mt-3 w-full p-4 flex items-center justify-between">
                                        <div className='w-[150px] h-[35px] flex items-center justify-center font-[OB] bg-[url(../public/captha.png)] bg-center rounded-lg' style={{ color: 'blue', fontSize: '18px' }}>{captchaQuestion}</div>
                                        <input
                                            type="text"
                                            value={captchaAnswer}
                                            onChange={(e) => setCaptchaAnswer(e.target.value)}
                                            placeholder='Введите ответ'
                                            className='input bg-[#D9D9D9] h-[35px] rounded-xl pl-4 ml-3 text-black w-full text-[14px]'
                                            required
                                        />
                                    </div>

                                    <div className="relative flex flex-col w-full items-center">
                                        <button type='submit' disabled={isLoading} className='mt-5 w-56 h-9 rounded-xl' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>
                                            {isLoading ?

                                                <div className='flex items-center justify-center'>
                                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                    </svg>
                                                    Загрузка...
                                                </div>

                                                :

                                                'Зарегистрироваться'

                                            }
                                        </button>
                                    </div>
                                </form>

                            }
                        </div>
                    </div>
            }
        </>
    );
};

export default LoginModal;