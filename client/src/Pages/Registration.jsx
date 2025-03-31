import React, { useEffect, useState } from 'react'
import { AuthService } from '../services/auth.service'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'react-responsive'
import { useAuth } from '../hooks/useAuth'
import { throttle } from 'lodash';

const Registration = () => {

  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [ref, setRef] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isAuth = useAuth();

  const navigate = useNavigate()

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

  const handleSubmit = throttle(async (e) => {
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
      let data;

      if (email) {
        if (ref) {
          data = await AuthService.registration({ email, login, password, ref });
        } else {
          data = await AuthService.registration({ email, login, password });
        }
      } else {
        if (ref) {
          data = await AuthService.registration({ login, password, ref });
        } else {
          data = await AuthService.registration({ login, password });
        }
      }

      toast.success('Аккаунт успешно создан!');
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      toast.error(errorMessage.toString());
    } finally {
      setIsLoading(false);
    }
  }, 1000);


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

            <>
              <div className='relative flex justify-center items-center mt-16 w-[100vw] bg-[url(../public/LoginBG2.png)] bg-cover bg-no-repeat bg-center '>
                <div className="relative flex items-center flex-col w-[90%] h-[650px] border-gray-400 rounded-[50px] border-[5px]" style={{ background: "linear-gradient(0deg, rgba(0,0,0,1) 10%, rgba(0,61,217, 1) 50%, rgba(0,0,0,1) 90%)" }}>
                  <img src="/public/logo2.svg" alt="" className='h-36 translate-y-[-50%]' />
                  <div className="flex flex-col items-center translate-y-[-15%] relative w-full">
                    <p className='font-[OSB] text-[20px] mt-7'>Добро пожаловать в Brand!</p>
                    <p className='w-3/5 text-center mt-2'>предрегистрационный текст</p>
                    <form className='relative flex flex-col w-4/5 mt-6 items-center' onSubmit={handleSubmit}>
                      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="text" className='input bg-[#D9D9D9] h-[35px] rounded-xl pl-4 text-black w-full' name="" placeholder='E-mail (необязательно)' />
                      <input id="login" value={login} onChange={(e) => setLogin(e.target.value)} type="text" className='input bg-[#D9D9D9] h-[35px] rounded-xl mt-7 pl-4 text-black w-full' name="" placeholder='Логин' required />
                      <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='input bg-[#D9D9D9] h-[35px] rounded-xl mt-7 pl-4 text-black w-full' name="" placeholder='Пароль' required />
                      <input id="ref" value={ref} onChange={(e) => setRef(e.target.value)} type="text" className='input bg-[#D9D9D9] h-[35px] rounded-xl mt-7 pl-4 text-[15px] text-black w-full' name="" placeholder='Реферальный код (необязательно)'  />


                      <label className="flex items-center bottom-0 left-0 mt-5 z-10">
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
                  </div>
                </div>
              </div>
            </>

            :

            <>
              <div className='relative flex justify-center mt-36 w-[100vw] h-[75vh] bg-[url(../public/LoginBG.png)] bg-cover bg-no-repeat bg-top '>
                <div className="relative flex items-center flex-col w-[588px] h-[650px] border-gray-400 rounded-[50px] border-[5px]" style={{ background: "linear-gradient(0deg, rgba(0,0,0,1) 10%, rgba(0,61,217, 1) 50%, rgba(0,0,0,1) 90%)" }}>
                  <img src="/public/logo2.svg" alt="" className='h-36 translate-y-[-50%]' />
                  <div className="flex flex-col items-center translate-y-[-15%] relative w-full">
                    <p className='font-[OSB] text-[20px] mt-7'>Добро пожаловать в Brand!</p>
                    <p className='w-3/5 text-center mt-2'>предрегистрационный текст</p>
                    <form className='relative flex flex-col w-4/5 mt-14 items-center' onSubmit={handleSubmit}>
                      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="text" className='input bg-[#D9D9D9] h-[35px] rounded-xl pl-4 text-black w-full' name="" placeholder='E-mail (необязательно)' />
                      <input id="login" value={login} onChange={(e) => setLogin(e.target.value)} type="text" className='input bg-[#D9D9D9] h-[35px] rounded-xl mt-7 pl-4 text-black w-full' name="" placeholder='Логин' required />
                      <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='input bg-[#D9D9D9] h-[35px] rounded-xl mt-7 pl-4 text-black w-full' name="" placeholder='Пароль' required />
                      <input id="ref" value={ref} onChange={(e) => setRef(e.target.value)} type="text" className='input bg-[#D9D9D9] h-[35px] rounded-xl mt-7 pl-4 text-black w-full' name="" placeholder='Реферальный код (необязательно)'  />

                      <label className="flex items-center bottom-0 left-0 mt-5 w-full">
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
                        <button type='submit' disabled={isLoading} className='mt-8 w-56 h-9 rounded-xl' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>
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
                  </div>
                </div>
              </div>
            </>
          }
        </>

      }
    </>
  )
}

export default Registration