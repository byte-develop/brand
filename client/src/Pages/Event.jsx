import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { AuthService } from '../services/auth.service';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useMediaQuery } from 'react-responsive';

const Event = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await AuthService.getMe();
                dispatch({ type: 'user/LoginSlice', payload: response });
            } catch (error) {
                console.error('Ошибка при получении профиля:', error);
            }
        };

        fetchUserProfile();
    }, [dispatch]);

    const fetchIp = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Ошибка при получении IP-адреса:', error);
            return null;
        }
    };

    const debouncedAddEvent = debounce(async () => {
        if (user && user.id) {
            const ip = await fetchIp();
            if (ip) {
                try {
                    const response = await axios.post('/api/event/add', {
                        user_id: user.id,
                        ip: ip
                    });
                } catch (error) {
                    toast.error('Ошибка');
                }
            } else {
                toast.error('Не удалось получить IP-адрес');
            }
        }
    }, 1000);

    const [event, setEvent] = useState(null);
    const [moderation, setModeration] = useState(false);
    const [succes, setSucces] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [ban, setBan] = useState(false);

    const fetchEvent = async () => {
        try {
            const response = await axios.get(`/api/event/user/${user.id}`);
            setEvent(response.data);
            if (response.data.moderation) {
                setModeration(true)
            }
            if (response.data.succes) {
                setSucces(true)
            }
            if (response.data.ban) {
                setBan(true)
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    const Event = () => {
        navigate(`/EventCase`)
    }


    useEffect(() => {
        fetchEvent();
    }, [user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEvent();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);


    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            if (event && event.my_ref) {
                try {
                    const response = await fetch('/api/user/ref', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ref: `${event.my_ref}` }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();

                    setCount(data.count);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        fetchCount();
    }, [event]);

    const copyToClipboard = () => {
        const textField = document.createElement('textarea');
        textField.innerText = event.my_ref;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        document.body.removeChild(textField);
    };


    const [telegramUsername, setTelegramUsername] = useState('');
    const [elementUsername, setElementUsername] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const screenshotsString = screenshots.join(', ');
        try {

            console.log('Отправляемые данные:', {
                user_id: user.id,
                telegram: telegramUsername,
            });

            setLoading3(true);
            const response = await fetch('/api/event/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    telegram: telegramUsername,
                    element: elementUsername,
                    photo: screenshotsString,
                    refs: count,

                }),
            });


            toast.success('Успешно отправлено:', response.data);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
            toast.error('Ошибка при отправке данных:', error.message);
        } finally {
            setLoading3(false);
        }
    };

    const [screenshots, setScreenshots] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const MAX_FILES = 4;

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);

        if (screenshots.length + files.length > MAX_FILES) {
            alert(`Вы можете загрузить максимум ${MAX_FILES} изображений.`);
            return;
        }

        const newScreenshots = [];
        const newFileNames = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append('image', file);
            setLoading2(true)
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=4007bef0ca3bc034d28d79572d765ec8`, formData);
            newScreenshots.push(response.data.data.url);
            newFileNames.push(file.name);
            setLoading2(false)
        }

        setScreenshots(prev => [...prev, ...newScreenshots]);
        setFileNames(prev => [...prev, ...newFileNames]);
    };

    const [isDateValid, setIsDateValid] = useState(false);

    useEffect(() => {
        const today = new Date();
        
        const targetDate = new Date(Date.UTC(2025, 0, 2, 13, 0));
    
        if (today >= targetDate) {
            setIsDateValid(true);
        } else {
            setIsDateValid(false);
        }
    }, []);
    

    return (
        <>
            {
                ban ?
                    <>
                        {
                            isMobile ?


                                <div className="h-[100vh] overflow-hidden w-full relative flex items-center flex-col" style={{ background: "linear-gradient(133deg, rgba(14,8,34,1) 0%, rgba(33,8,118,1) 100%)" }}>
                                    <p className='z-10 relative font-[PR] text-[64px] mt-28'>Упс!</p>
                                    <p className='z-10 relative text-[24px] w-[70%] text-center' style={{ whiteSpace: "normal" }}>К сожалению, вы были дискфалифицированы.</p>
                                    <p className='z-10 relative w-[80%] text-center mt-4' style={{ whiteSpace: "normal" }}>Если вы считаете, что произошла ошибка, свяжитесь с <span className='text-[#AF98FF]'><Link to={'/help'}>нами</Link></span>.</p>
                                    <img src="../public/event/upsm.png" className='w-full absolute top-0' alt="" />
                                </div>

                                :


                                <div className="h-[90vh] overflow-hidden w-full relative flex items-center flex-col" style={{ background: "linear-gradient(133deg, rgba(14,8,34,1) 0%, rgba(33,8,118,1) 100%)" }}>
                                    <p className='z-10 relative font-[PR] text-[128px] mt-28'>Упс!</p>
                                    <p className='z-10 relative text-[32px]'>К сожалению, вы были дискфалифицированы.</p>
                                    <p className='z-10 relative w-[20%] text-center' style={{ whiteSpace: "normal" }}>Если вы считаете, что произошла ошибка, свяжитесь с <span className='text-[#AF98FF]'><Link to={'/help'}>нами</Link></span>.</p>
                                    <img src="../public/event/ups.png" className='w-full absolute top-0' alt="" />
                                </div>
                        }
                    </>

                    :

                    <>
                        {
                            isMobile ?

                                <div className='w-full h-full bg-[#0E0822] overflow-hidden'>
                                    <div className="h-[90vh] w-full bg-[url(../public/event/bgm.svg)] bg-center bg-no-repeat bg-cover relative flex items-center justify-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src="../public/event/logo.png" alt="" />
                                            <p className='font-[PR] text-[42px] mt-6'>НОВЫЙ ГОД</p>
                                            <p className='text-[24px]'>с Brand Chart</p>
                                            <img src="../public/event/snowm1.png" className='w-full absolute bottom-0 translate-y-[60%] z-10' alt="" />
                                        </div>

                                    </div>

                                    <div className="h-[100vh] w-full relative flex  items-center justify-center">
                                        <img src="../public/event/snow2.png" className='w-full absolute bottom-0 translate-y-[60%] z-10' alt="" />
                                        <img src="../public/event/threes.png" className='w-full absolute bottom-0 translate-y-[-20%]' alt="" />
                                        <img src="../public/event/stars1.svg" className='absolute top-0 left-0 w-[50%]' alt="" />
                                        <img src="../public/event/stars2.svg" className='absolute top-0 right-0 w-[50%]' alt="" />
                                        <div className="flex flex-col items-center justify-center w-[80%] text-center z-10" style={{ whiteSpace: "normal" }}>
                                            <p className='text-[40px] font-[PR]'>НОВОГОДНИЙ КОНКУРС</p>
                                            <p className='text-[20px] font-[OSB] mt-5'>С Новым годом, BRAND!</p>
                                            <p className='text-[20px] mt-5'>Пусть этот праздник будет по-настоящему особенным!
                                                Мы подготовили масштабный розыгрыш с крутыми призами.</p>
                                            <p className='text-[20px] mt-3'>Не упустите шанс начать год с ярких эмоций!
                                                Участвуйте и выигрывайте ценные подарки.</p>
                                            <p className='text-[20px] mt-3'>По дополнительным вопросам обращаться к <span className='text-[#9500FF] underline'><Link to={'/help'}>администрации</Link></span>.</p>
                                        </div>
                                    </div>
                                    <div className="h-[110vh] min-h-[900px] w-full relative flex flex-col items-center mt-[20vh]">
                                        <img src="../public/event/snow3.png" alt="" className='absolute bottom-0 w-full' />
                                        <p className='font-[PR] text-[40px]'>ПРИЗЫ</p>
                                        <div className="flex">
                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize1.png" alt="" className="h-auto min-w-[45vw] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className='text-center'>
                                                    5 приза по 50$<br />
                                                    Бинго с 4 цифрами<br />
                                                    Монеты до 5000
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize2.png" alt="" className="h-auto min-w-[45vw] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className='text-center'>
                                                    2 скидки по 20%
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize3.png" alt="" className="h-auto min-w-[45vw] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className='text-center'>
                                                    2 скидки по 10%
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize4.png" alt="" className="h-auto min-w-[45vw] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className='text-center'>
                                                    3 приза по 1 гр
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex">

                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize5.png" alt="" className="h-auto min-w-[45vw] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className='text-center'>
                                                    3 приза по 1 гр
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize6.png" alt="" className="h-auto min-w-[45vw] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className=' text-center'>
                                                    3 приза по 1 гр
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[135vh] min-h-[1300px] w-full relative flex flex-col items-center" style={{ background: "linear-gradient(180deg, rgba(14,8,34,1) 6%, rgba(53,27,66,1) 51%, rgba(121,54,81,1) 100%)" }}>
                                        <img src="../public/event/stars3.svg" className='absolute top-0 w-full' alt="" />
                                        <img src="../public/event/snow4.png" alt="" className='absolute bottom-0 w-full' />
                                        <img src="../public/event/deer.png" alt="" className='absolute bottom-0 left-[50%] translate-x-[-50%] translate-y-[12%] z-10' />
                                        <p className='font-[PR] text-[40px] mt-24'>ПРАВИЛА</p>

                                        <p className='w-[70%] mt-14' style={{ whiteSpace: "normal" }}>1. Участие в розыгрыше доступно только с одного аккаунта.
                                            За использование нескольких аккаунтов (мультиаккаунтинг) участник будет дисквалифицирован, и заблокирован. <br /><br />

                                            2. Применение багов, ошибок системы и сторонних програм
                                            для получения преимущества строго запрещено. За багоюз участник немедленно исключается из конкурса и блокируется.<br /><br />

                                            3. Злоупотребление механиками конкурса (абуз) приведет к дисквалификации и запрету на участие.<br /><br />

                                            4. Администрация оставляет за собой право проверять действия участников и принимать окончательное решение в спорных ситуациях.<br /><br />

                                            5. Участие в конкурсе автоматически подтверждает согласие с данными правилами.6. Нарушение любого пункта влечет исключение из конкурса без возможности восстановления.</p>

                                    </div>

                                    <div className="h-[100vh] w-full relative flex justify-center">
                                        <p className='text-[40px] font-[PR] mt-24'>ПАРТНЕРЫ</p>
                                        <img src="../public/event/stars4.svg" alt="" className='absolute w-full top-0' />
                                        <img src="../public/event/threesm.png" alt="" className='absolute bottom-[20%] w-full z-10' />
                                        <img src="../public/event/snownadm.png" alt="" className='absolute bottom-0 w-full z-30' />
                                        <img src="../public/event/el.png" alt="" className='absolute bottom-[12%] z-20 h-[60vh]' />
                                        <img src="../public/event/snowm2.png" alt="" className='absolute bottom-0 w-full z-10' />
                                        <img src="../public/event/snowm3.png" alt="" className='absolute bottom-0 w-full translate-y-[50%] z-30' />

                                    </div>

                                    <div className="h-[100vh] min-h-[1600px] w-full relative flex flex-col items-center" style={{ background: "linear-gradient(180deg, rgba(14,8,34,1) 6%, rgba(53,27,66,1) 51%, rgba(121,54,81,1) 100%)" }}>
                                        <img src="../public/event/santa.png" alt="" className='w-[90%] mt-12' />
                                        <p className='text-[40px] font-[PR]'>УСЛОВИЯ</p>
                                        <p className='text-[16px] w-[80%] text-center mt-16' style={{ whiteSpace: "normal" }}>
                                            После выполнения всех условий отправьте ваши медиафайлы на проверку.
                                            По окончании модерации вы станете участиком конкурса и откроется доступ к новогоднему кейсу. 31.12.2024 вы сможете открыть его и получить свой приз.
                                        </p>
                                        <img src="../public/event/bg5.svg" alt="" className='absolute bottom-0 w-full z-10' />
                                        <img src="../public/event/stars5.svg" alt="" className='absolute top-0 w-full' />
                                        <img src="../public/event/snow6.png" alt="" className='absolute bottom-0 w-full translate-y-[60%] z-30' />

                                        <form onSubmit={handleSubmit} className="flex flex-col items-center">
                                            <div className="flex flex-col items-center gap-28 z-30">
                                                <div className="flex flex-col items-center mt-8">
                                                    <input
                                                        placeholder='Введите юзернейм в Telegram'
                                                        type="text"
                                                        value={telegramUsername}
                                                        onChange={(e) => setTelegramUsername(e.target.value)}
                                                        required={true}
                                                        className='text-center text-[20px] rounded-xl border-[2px] h-[50px] w-[80%] bg-[#211131] bg-opacity-55'
                                                    />
                                                    <div className="mt-7 z-30 flex-col flex items-center">
                                                        <div className="h-[200px] w-[80%] bg-[#FCE1FF] bg-opacity-25 rounded-3xl flex items-center justify-center flex-col gap-5">
                                                            <div className={`flex w-[90%] h-[50px] items-center rounded-xl bg-[#211131] bg-opacity-50 ${succes && "line-through text-opacity-50 text-white"}`}>
                                                                <img src={succes ? "../public/event/point2.png" : "../public/event/point.png"} alt="" className='w-[20px] ml-4' />
                                                                <p className='text-[16px] ml-5 mr-4' style={{ whiteSpace: "normal" }}>Подписаться на канал Brand Chart</p>
                                                            </div>

                                                            <div className={`flex w-[90%] h-[80px] items-center rounded-xl bg-[#211131] bg-opacity-50 ${succes && "line-through text-opacity-50 text-white"}`}>
                                                                <img src={succes ? "../public/event/point2.png" : "../public/event/point.png"} alt="" className='w-[20px] ml-4' />
                                                                <p className='text-[16px] ml-5 mr-4' style={{ whiteSpace: "normal" }}>Пригласить 3-х человек на сайт по реферальному коду ({count}/3)</p>
                                                            </div>
                                                        </div>


                                                        <label>
                                                            <button
                                                                type="button"
                                                                className="flex w-[80vw] h-[50px] items-center rounded-xl bg-[#211131] bg-opacity-50 mt-7 justify-around"
                                                                onClick={() => document.getElementById('file-input').click()}
                                                                disabled={loading2 | moderation | succes}
                                                            >
                                                                <p className='text-[16px]' style={{ whiteSpace: "normal" }}>Загрузите ваши скриншоты</p>
                                                                {loading2 ?
                                                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                                    </svg>
                                                                    :
                                                                    <img src="../public/event/load.png" alt="" className='w-[25px] ml-4' />
                                                                }
                                                            </button>
                                                        </label>
                                                        <input
                                                            id="file-input"
                                                            type="file"
                                                            onChange={handleFileChange}
                                                            accept="image/*"
                                                            multiple
                                                            style={{ display: 'none' }}
                                                        />
                                                        {screenshots.length > 0 && (
                                                            <div className="mt-4 bg-[#211131] bg-opacity-50 p-5 w-[80vw] rounded-xl text-[16px]">
                                                                <h3 className="text-[18px]">Загруженные файлы:</h3>
                                                                <ul className=''>
                                                                    {fileNames.map((name, index) => (
                                                                        <li className='bg-[#211131] bg-opacity-90 mt-2 p-2 rounded-lg ' key={index}>{name}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        <div className="mt-20 relative flex justify-center">
                                                            <p className='font-[PR] text-[40px] absolute translate-y-[-60%]'>ВАШ КОД</p>
                                                            <div className="w-[80vw] h-[80px] bg-[#FCE1FF] bg-opacity-35 rounded-3xl flex items-center justify-center">
                                                                <p className='text-[24px] font-[OL]'>{event ? event.my_ref : "Загрузка"}</p>
                                                                <button type="button" onClick={copyToClipboard}>
                                                                    <img src="../public/event/copy.png" alt="" className='ml-3 h-[22px]' />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className='w-[80vw] text-center text-[14px]' style={{ whiteSpace: "normal" }}>
                                                            Приглашенный пользователь должен ввести ваш реферальный код при регистрации.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button disabled={loading2 | moderation | succes} type='submit' className='mt-12 w-[300px] h-[70px] bg-[#281538] text-[32px] rounded-full z-30'>
                                                {loading3 ?
                                                    <div className='flex items-center justify-center'>
                                                        <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                            <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                        </svg>
                                                        Загрузка...
                                                    </div>

                                                    :

                                                    <>
                                                        {
                                                            event ?

                                                                <>
                                                                    {
                                                                        event.moderation ?

                                                                            "На проверке"

                                                                            :

                                                                            <>
                                                                                {
                                                                                    event.succes ?

                                                                                        "Участвуете"

                                                                                        :

                                                                                        "Отправить"
                                                                                }
                                                                            </>
                                                                    }
                                                                </>

                                                                :

                                                                <div className='flex items-center justify-center'>
                                                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                                    </svg>
                                                                    Загрузка...
                                                                </div>}
                                                    </>
                                                }
                                            </button>
                                        </form>
                                    </div>

                                    <div className="h-[130vh] w-full relative flex flex-col items-center justify-between">
                                        <p className='font-[PR] text-[48px] z-30 w-[80%] text-center mt-32' style={{ whiteSpace: "normal" }}>НОВОГОДНИЙ КЕЙС</p>
                                        <img src="../public/event/snowlastm.png" className='absolute bottom-0 w-full' alt="" />
                                        <img src="../public/event/starslast.png" className='absolute top-0 w-full' alt="" />
                                        <img src="../public/event/casem.png" className='absolute top-0 w-full z-10' alt="" />
                                        <img src="../public/event/vetka1m.png" className='absolute top-[10%] left-0' alt="" />
                                        <img src="../public/event/vetka2m.png" className='absolute top-[10%] right-0 z-10' alt="" />
                                        <button onClick={() => Event()} className='w-[80%] h-[56px]  text-[18px] rounded-3xl z-30 mb-32' style={{ background: 'linear-gradient(133deg, rgba(84,11,126,1) 0%, rgba(139,21,207,1) 63%, rgba(84,11,126,1) 98%)' }}>
                                            Открыть
                                        </button>

                                    </div>
                                </div>

                                :

                                <div className='w-full h-full bg-[#0E0822] overflow-hidden mt-4'>
                                    <div className="h-[90vh] w-full bg-[url(../public/event/bg1.svg)] bg-center bg-no-repeat bg-cover  relative flex items-center justify-center">
                                        <img src="../public/event/snow1.png" className='w-full absolute bottom-0 translate-y-[60%]' alt="" />
                                        <div className="w-[528px] h-[215px] flex flex-col items-center justify-center rounded-xl bg-[#550D71] bg-opacity-75">
                                            <p className='font-[PR] text-[96px]'>НОВЫЙ ГОД</p>
                                            <p className='text-[48px]'>с Brand Chart</p>
                                        </div>
                                    </div>

                                    <div className="h-[125vh] w-full relative flex  items-center justify-center">
                                        <img src="../public/event/snow2.png" className='w-full absolute bottom-0 translate-y-[60%] z-10' alt="" />
                                        <img src="../public/event/threes.png" className='w-full absolute bottom-0 translate-y-[-20%]' alt="" />
                                        <img src="../public/event/stars1.svg" className='absolute top-0 left-0 w-[50%]' alt="" />
                                        <img src="../public/event/stars2.svg" className='absolute top-0 right-0 w-[50%]' alt="" />
                                        <div className="flex flex-col items-center justify-center w-[60%] text-center z-10" style={{ whiteSpace: "normal" }}>
                                            <p className='text-[64px] font-[PR]'>НОВОГОДНИЙ КОНКУРС</p>
                                            <p className='text-[36px] font-[OSB] mt-5'>С Новым годом, BRAND!</p>
                                            <p className='text-[32px] mt-5'>Пусть этот праздник будет по-настоящему особенным!
                                                Мы подготовили масштабный розыгрыш с крутыми призами.</p>
                                            <p className='text-[32px] mt-3'>Не упустите шанс начать год с ярких эмоций!
                                                Участвуйте и выигрывайте ценные подарки.</p>
                                            <p className='text-[32px] mt-3'>По дополнительным вопросам обращаться к <span className='text-[#9500FF] underline'><Link to={'/help'}>администрации</Link></span>.</p>
                                        </div>
                                    </div>
                                    <div className="h-[180vh] w-full relative flex flex-col items-center mt-[750px]">
                                        <img src="../public/event/snow3.png" alt="" className='absolute bottom-0 w-full' />
                                        <p className='font-[PR] text-[64px]'>ПРИЗЫ</p>
                                        <div className="flex gap-6">
                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize1.png" alt="" className="h-auto min-w-[445px] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className='text-[26px] text-center'>
                                                    5 приза по 50$<br />
                                                    Бинго с 4 цифрами<br />
                                                    Монеты до 5000
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize2.png" alt="" className="h-auto min-w-[445px] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className='text-[26px] text-center'>
                                                    2 скидки по 20%
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize3.png" alt="" className="h-auto min-w-[445px] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className='text-[26px] text-center'>
                                                    2 скидки по 10%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-6">
                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize4.png" alt="" className="h-auto min-w-[445px] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className='text-[26px] text-center'>
                                                    3 приза по 1 гр
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize5.png" alt="" className="h-auto min-w-[445px] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className='text-[26px] text-center'>
                                                    3 приза по 1 гр
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <img src="../public/event/prize6.png" alt="" className="h-auto min-w-[445px] mr-4" />
                                                <p style={{ whiteSpace: "normal" }} className='text-[26px] text-center'>
                                                    3 приза по 1 гр
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[160vh] w-full relative flex flex-col items-center" style={{ background: "linear-gradient(180deg, rgba(14,8,34,1) 6%, rgba(53,27,66,1) 51%, rgba(121,54,81,1) 100%)" }}>
                                        <img src="../public/event/stars3.svg" className='absolute top-0 w-full' alt="" />
                                        <img src="../public/event/snow4.png" alt="" className='absolute bottom-0 w-full' />
                                        <img src="../public/event/deer.png" alt="" className='absolute bottom-0 left-[50%] translate-x-[-50%] translate-y-[12%] z-10' />
                                        <p className='font-[PR] text-[64px] mt-24'>ПРАВИЛА</p>

                                        <p className='text-[28px] w-[70%] mt-14' style={{ whiteSpace: "normal" }}>1. Участие в розыгрыше доступно только с одного аккаунта.
                                            За использование нескольких аккаунтов (мультиаккаунтинг) участник будет дисквалифицирован, и заблокирован. <br /><br />

                                            2. Применение багов, ошибок системы и сторонних програм
                                            для получения преимущества строго запрещено. За багоюз участник немедленно исключается из конкурса и блокируется.<br /><br />

                                            3. Злоупотребление механиками конкурса (абуз) приведет к дисквалификации и запрету на участие.<br /><br />

                                            4. Администрация оставляет за собой право проверять действия участников и принимать окончательное решение в спорных ситуациях.<br /><br />

                                            5. Участие в конкурсе автоматически подтверждает согласие с данными правилами.6. Нарушение любого пункта влечет исключение из конкурса без возможности восстановления.</p>

                                    </div>

                                    <div className="h-[120vh] w-full relative flex justify-center">
                                        <p className='text-[64px] font-[PR] mt-24'>ПАРТНЕРЫ</p>
                                        <img src="../public/event/stars4.svg" alt="" className='absolute w-full top-0' />
                                        <img src="../public/event/threes2.png" alt="" className='absolute bottom-[25%] w-full z-10' />
                                        <img src="../public/event/snownad.png" alt="" className='absolute bottom-0 w-full z-20' />
                                        <img src="../public/event/el.png" alt="" className='absolute bottom-[12%] z-20' />
                                        <img src="../public/event/snow_el.png" alt="" className='absolute bottom-0 w-full z-20' />
                                        <img src="../public/event/snow5.png" alt="" className='absolute bottom-0 w-full translate-y-[40%] z-30' />
                                    </div>

                                    <div className="h-[235vh] w-full relative flex flex-col items-center" style={{ background: "linear-gradient(180deg, rgba(14,8,34,1) 6%, rgba(53,27,66,1) 51%, rgba(121,54,81,1) 100%)" }}>
                                        <p className='text-[64px] font-[PR] mt-32'>УСЛОВИЯ</p>
                                        <p className='text-[32px] w-[80%] text-center mt-16' style={{ whiteSpace: "normal" }}>
                                            После выполнения всех условий отправьте ваши медиафайлы на проверку.
                                            По окончании модерации появится кнопка “участвовать”, и откроется доступ к новогоднему кейсу. 31.12.2024 вы сможете открыть его и получить свой приз.
                                        </p>
                                        <img src="../public/event/bg5.svg" alt="" className='absolute bottom-0 w-full z-10' />
                                        <img src="../public/event/stars5.svg" alt="" className='absolute top-0 w-full' />
                                        <img src="../public/event/snow6.png" alt="" className='absolute bottom-0 w-full translate-y-[60%] z-30' />

                                        <form onSubmit={handleSubmit} className="flex flex-col items-center">
                                            <div className="flex gap-28 z-30">
                                                <div className="flex flex-col">
                                                    <img src="../public/event/santa.png" alt="" />
                                                    <input
                                                        placeholder='Введите юзернейм в Telegram'
                                                        type="text"
                                                        value={telegramUsername}
                                                        onChange={(e) => setTelegramUsername(e.target.value)}
                                                        required={true}
                                                        className='text-center text-[32px] rounded-3xl border-[2px] h-[100px] w-[532px] bg-[#211131] bg-opacity-55'
                                                    />
                                                    <div className="mt-20 relative flex justify-center">
                                                        <p className='font-[PR] text-[80px] absolute translate-y-[-60%]'>ВАШ КОД</p>
                                                        <div className="w-[542px] h-[155px] bg-[#FCE1FF] bg-opacity-35 rounded-3xl flex items-center justify-center">
                                                            <p className='text-[48px] font-[OL]'>{event ? event.my_ref : "Загрузка"}</p>
                                                            <button type="button" onClick={copyToClipboard}>
                                                                <img src="../public/event/copy.png" alt="" className='ml-3' />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className='w-[542px] text-center text-[24px]' style={{ whiteSpace: "normal" }}>
                                                        Приглашенный пользователь должен ввести ваш реферальный код при регистрации.
                                                    </p>
                                                </div>

                                                <div className="mt-32 z-30">
                                                    <div className="h-[344px] w-[600px] bg-[#FCE1FF] bg-opacity-25 rounded-3xl flex items-center justify-center flex-col gap-5">
                                                        <div className={`flex w-[526px] h-[100px] items-center rounded-3xl bg-[#211131] bg-opacity-50 ${succes && "line-through text-opacity-50 text-white"}`}>
                                                            <img src={succes ? "../public/event/point2.png" : "../public/event/point.png"} alt="" className='w-[40px] ml-4' />
                                                            <p className='text-[26px] ml-5 mr-4' style={{ whiteSpace: "normal" }}>Подписаться на канал Brand Chart</p>
                                                        </div>

                                                        <div className={`flex w-[526px] h-[100px] items-center rounded-3xl bg-[#211131] bg-opacity-50 ${succes && "line-through text-opacity-50 text-white"}`}>
                                                            <img src={succes ? "../public/event/point2.png" : "../public/event/point.png"} alt="" className='w-[40px] ml-4' />
                                                            <p className='text-[26px] ml-5 mr-4' style={{ whiteSpace: "normal" }}>Пригласить 3-х человек на сайт по реферальному коду ({count}/3)</p>
                                                        </div>
                                                    </div>

                                                    <label>
                                                        <button
                                                            type="button"
                                                            className="flex w-[526px] h-[100px] items-center rounded-3xl bg-[#211131] bg-opacity-50 mt-24 justify-around"
                                                            onClick={() => document.getElementById('file-input').click()}
                                                            disabled={loading2 | moderation | succes}
                                                        >
                                                            <p className='text-[26px]' style={{ whiteSpace: "normal" }}>Загрузите ваши скриншоты</p>
                                                            {loading2 ?
                                                                <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                                    <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                                </svg>
                                                                :
                                                                <img src="../public/event/load.png" alt="" className='w-[40px] ml-4' />
                                                            }
                                                        </button>
                                                    </label>
                                                    <input
                                                        id="file-input"
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                        multiple
                                                        style={{ display: 'none' }}
                                                    />
                                                    {screenshots.length > 0 && (
                                                        <div className="mt-4 bg-[#211131] bg-opacity-50 p-5 w-[526px] rounded-3xl text-[18px]">
                                                            <h3 className="text-[22px]">Загруженные файлы:</h3>
                                                            <ul className=''>
                                                                {fileNames.map((name, index) => (
                                                                    <li className='bg-[#211131] bg-opacity-90 mt-2 p-2 rounded-lg ' key={index}>{name}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <button disabled={loading2 | moderation | succes} type='submit' className='mt-32 w-[300px] h-[70px] bg-[#281538] text-[32px] rounded-full z-30'>
                                                {loading3 ?
                                                    <div className='flex items-center justify-center'>
                                                        <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                            <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                        </svg>
                                                        Загрузка...
                                                    </div>

                                                    :

                                                    <>
                                                        {
                                                            event ?

                                                                <>
                                                                    {
                                                                        event.moderation ?

                                                                            "На проверке"

                                                                            :

                                                                            <>
                                                                                {
                                                                                    event.succes ?

                                                                                        "Участвуете"

                                                                                        :

                                                                                        "Отправить"
                                                                                }
                                                                            </>
                                                                    }
                                                                </>

                                                                :

                                                                <div className='flex items-center justify-center'>
                                                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                                    </svg>
                                                                    Загрузка...
                                                                </div>}
                                                    </>
                                                }
                                            </button>
                                        </form>
                                    </div>

                                    <div className="h-[160vh] w-full relative flex flex-col items-center justify-between">
                                        <p className='font-[PR] text-[96px] z-30 w-[30%] text-center mt-32' style={{ whiteSpace: "normal" }}>НОВОГОДНИЙ КЕЙС</p>
                                        <img src="../public/event/snowlast.png" className='absolute bottom-0 w-full' alt="" />
                                        <img src="../public/event/starslast.png" className='absolute top-0 w-full' alt="" />
                                        <img src="../public/event/case.png" className='absolute top-0 w-full z-10' alt="" />
                                        <img src="../public/event/vetka1.png" className='absolute top-[10%] left-0' alt="" />
                                        <img src="../public/event/vetka2.png" className='absolute top-[10%] right-0 z-10' alt="" />
                                        <button
                                            onClick={() => Event()}
                                            className='flex items-center justify-center w-[537px] h-[113px] text-[32px] rounded-xl z-30 mb-32'
                                            style={{ background: 'linear-gradient(133deg, rgba(84,11,126,1) 0%, rgba(139,21,207,1) 63%, rgba(84,11,126,1) 98%)' }}
                                        >
                                            Открыть
                                        </button>
                                    </div>
                                </div>

                        }
                    </>
            }
        </>
    )
}

export default Event