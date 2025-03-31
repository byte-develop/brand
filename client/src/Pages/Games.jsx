import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthService } from '../services/auth.service';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal'
import "./games.css"
import { useMediaQuery } from 'react-responsive';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import TransferItem from './TransferItem';
import PromocodeItem from './PromocodeItem';

const Games = () => {
    const dispatch = useDispatch();
    const [cooldown, setCooldown] = useState()
    const isAuth = useAuth();
    const user = useSelector((state) => state.user.user);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [transfers, setTransfers] = useState([]);
    const [showTransfersModal, setShowTransfersModal] = useState(false);
    const [showPromocodesModal, setShowPromocodesModal] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await AuthService.getMe();
                dispatch({ type: 'user/LoginSlice', payload: response });
            } catch (error) {

            }
        };

        fetchUserProfile();
    }, [dispatch]);

    const GetBalance = async () => {
        if (user && user.id) {
            try {
                const response = await fetch('/bonus/get_balance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ID: user.id }),
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                setBalance(data.balance);
            } catch (error) {
                console.error('Ошибка при получении баланса:', error);
            }
        }
    };

    useEffect(() => {
        const GetCooldown = async () => {
            if (user && user.id) {
                try {
                    const response = await fetch('/bonus/get_cooldown', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ID: user.id }),
                    });

                    if (!response.ok) throw new Error('Network response was not ok');

                    const data = await response.json();

                    if (data.remaining_time == 0) {
                        setCooldown(0)
                    } else {
                        setCooldown(data.remaining_time);
                    }
                } catch (error) {
                    console.error('Ошибка при получении:', error);
                }
            }
        };

        GetCooldown();
    }, [user]);



    useEffect(() => {
        if (!isAuth) {
            setShowModal(true);
        }
    }, [isAuth]);

    const closeModal = () => {
        setShowModal(false);
    };

    const [bonusNum, setBonusNum] = useState()
    const [time, setTime] = useState()

    const GetBonus = async () => {
        if (user && user.id) {
            try {
                const response = await fetch('/api/user/bonus_num', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id }),
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();

                setBonusNum(data.bonus_num)

                if (!data.timeRemaining) {
                    setTime(0)
                } else {
                    setTime(data.timeRemaining)
                }

            } catch (error) {
                console.error('Ошибка при получении:', error);
            }
        }
    };

    useEffect(() => {
        GetBonus();
    }, [user]);

    const fetchTransfers = async () => {
        const response = await fetch(`/api/transfers?id_user=${user.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setTransfers(data);
    };

    useEffect(() => {
        if (user) {
            fetchTransfers();
        }
    }, [user]);

    const Bonus = async () => {
        setLoading(true)
        if (user && user.id) {
            try {
                const response = await fetch('/api/user/bonus', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id }),
                });

                if (!response.ok) throw new Error('Network response was not ok');
                GetBonus();
                fetchTransfers()
                GetBalance()
            } catch (error) {
                console.error('Ошибка при получении:', error);
            } finally {
                setLoading(false)
            }
        }
    };

    const [promocodes, setPromocodes] = useState([]);

    useEffect(() => {
        const fetchPromocodes = async () => {
            if (user && user.id) {
                try {
                    const response = await fetch(`/api/promocode?userid=${user.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setPromocodes(data);
                } catch (error) {
                    console.error('Ошибка при получении промокодов:', error);
                    setPromocodes([]);
                }
            }
        };
        fetchPromocodes();
    }, [user]);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const [currentIndex, setCurrentIndex] = useState(0);
    const items = [
        {
            id: 1,
            img: "../public/general.png",
            name: "ОБЫЧНЫЙ",
            label: "general",
            price: 250,
        },
        {
            id: 2,
            img: "../public/rare.png",
            name: "РЕДКИЙ",
            label: "rare",
            price: 500,
        },
        {
            id: 3,
            img: "../public/legendary.png",
            name: "ЛЕГЕНДАРНЫЙ",
            label: "legendary",
            price: 1000,
        },
    ];

    const handleChange = (index) => {
        setCurrentIndex(index);
    };

    const renderArrowPrev = (onClickHandler, hasPrev) => {
        return (
            <button
                className={`rounded-full custom-arrow left-arrow z-30 ${!hasPrev ? 'hidden' : ''}`}
                onClick={onClickHandler}
                style={{ left: '10px', position: 'absolute', top: '50%', transform: 'translateY(-50%)', boxShadow: "0px 0px 10px 5px rgba(0, 40, 184, 1)" }}
            >
                <img src="../public/l.png" alt="" />
            </button>
        );
    };

    const renderArrowNext = (onClickHandler, hasNext) => {
        return (
            <button
                className={`rounded-full custom-arrow right-arrow z-30 ${!hasNext ? 'hidden' : ''}`}
                onClick={onClickHandler}
                style={{ right: '10px', position: 'absolute', top: '50%', transform: 'translateY(-50%)', boxShadow: "0px 0px 10px 5px rgba(0, 40, 184, 1)" }}
            >
                <img src="../public/к.png" alt="" />
            </button>
        );
    };

    const [gamesAds, setGamesAds] = useState([]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const gamesResponse = await axios.get('/api/ads/games');

                setGamesAds(gamesResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAds();
    }, []);

    useEffect(() => {
        GetBalance();
    }, [user]);


    return (
        <>
            {isMobile ?


                <div className='flex flex-col items-center pt-20 pb-40 w-[100vw] relative overflow-hidden'>

                    <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-0 top-[25vh]" style={{ boxShadow: "0px 0px 100px 80px rgba(0, 40, 184, 1)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute right-0 top-[40vh]" style={{ boxShadow: "0px 0px 100px 80px rgba(0, 40, 184, 1)" }}></div>
                    <img src="../public/clever.png" alt="" className='absolute left-[-5vw] h-[68px]' />
                    <img src="../public/clever2.png" alt="" className='absolute right-0 top-[25vh] h-[44px]' />
                    <img src="../public/priz.png" alt="" className='absolute left-[-9vw] top-[30vh] h-[129px]' />
                    <img src="../public/priz2.png" alt="" className='absolute right-[-2vw] top-[40vh] h-[117px]' />


                    {showModal && <LoginModal onClose={closeModal} />}
                    <p className='font-[OEB] text-[30px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>BRAND GAMES</p>
                    <div className="flex flex-col items-center mt-3">
                        <p className='text-center font-[OL] text-[12px] w-[70%] ' style={{ whiteSpace: "normal" }}>Брендкоины — это ваши накопленные электронные деньги на нашем сайте.</p>
                        <p className='text-center font-[OL] text-[12px] w-[70%] mt-3' style={{ whiteSpace: "normal" }}>Их можно поменять на реальные деньги до 2000 тенге в виде скидки у некоторых наших партнёров. После обмена ваши деньги сгорают.</p>
                        <p className='text-center font-[OL] text-[12px] w-[70%] mt-3' style={{ whiteSpace: "normal" }}>Баланс будет отображаться в личном кабинете.</p>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center">
                        <p className='font-[OB] text-[30px] text-transparent mt-20' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ПАРТНЕРЫ</p>
                        <p className='text-[12px] font-[OL] mt-5'>Здесь можно обменять брендкоины и получить призы</p>
                        <div className="flex gap-6 overflow-x-scroll justify-start items-center  mt-10 w-[100vw] px-2" style={{ whiteSpace: 'nowrap' }}>
                            <Link to={'/shop/37'} className=''>
                                <img src="../public/skitty.png" alt="" className='min-w-[125px] min-h-[140px]' />
                            </Link>
                            <Link to={'/shop/96'} className=''>
                                <img src="../public/vinci.png" alt="" className='min-w-[125px] min-h-[140px]' />
                            </Link>
                            <Link to={'/shop/131'} className=''>
                                <img src="../public/line.png" alt="" className='min-w-[125px] min-h-[140px]' />
                            </Link>
                            <Link to={'/shop/3'} className=''>
                                <img src="../public/garage.png" alt="" className='min-w-[125px] min-h-[140px]' />
                            </Link>
                            <Link to={'/shop/100'} className=''>
                                <img src="../public/lee.png" alt="" className='min-w-[125px] min-h-[140px]' />
                            </Link>
                        </div>

                    </div>

                    <div className="w-full items-center mt-16">
                        <div className="flex flex-col items-center">
                            <p className="text-[32px] font-[OB] text-transparent flex items-center" style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>Баланс: {balance} <img src="../public/cointr.svg" alt="" className='h-6 ml-2' /></p>
                            <div className="w-full flex justify-end">
                                <button
                                    onClick={() => setShowTransfersModal(true)}
                                    className="px-4 mt-3 font-[OSB] text-[20px] text-[#0600B7]"
                                >
                                    Показать все
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-4 items-center">
                            {
                                transfers.length === 0 ?

                                    <div className="flex items-center justify-center h-[200px] w-full">
                                        <p className='text-white font-[OB] text-[32px]'>Пусто</p>
                                    </div>

                                    :

                                    transfers.sort((a, b) => a.position_numer - b.position_numer)
                                        .slice(0, 4)
                                        .map(transfer => (
                                            <TransferItem
                                                key={transfer.id}
                                                name={transfer.key}
                                                id_user={transfer.id_user}
                                                price={transfer.price}
                                                date={transfer.date}
                                            />
                                        ))
                            }
                        </div>

                        {showTransfersModal && (
                            <div className="fixed inset-0 flex items-center justify-center" style={{ position: 'fixed', zIndex: 9999 }}>
                                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
                                <div className="relative bg-[#232222] bg-opacity-20 backdrop-blur-3xl p-8 rounded-xl w-[90%] max-h-[80vh] overflow-y-auto">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-[OB]">История баланса</h2>
                                        <button
                                            onClick={() => setShowTransfersModal(false)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="flex gap-3 flex-wrap">
                                        {transfers.sort((a, b) => a.position_numer - b.position_numer)
                                            .map(transfer => (
                                                <TransferItem
                                                    key={transfer.id}
                                                    name={transfer.key}
                                                    id_user={transfer.id_user}
                                                    price={transfer.price}
                                                    date={transfer.date}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-10 mr-10">
                        <div className="flex flex-col items-center">
                            <p className="text-[32px] font-[OB] text-transparent flex items-center" style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>Промокоды</p>
                        </div>
                        <div className="flex gap-5 overflow-x-scroll mt-8 justify-start w-[100vw] pl-12">
                            {
                                promocodes.length === 0 ?

                                    <div className="flex items-center justify-center h-[200px] w-full">
                                        <p className='text-white font-[OB] text-[32px]'>Пусто</p>
                                    </div>
                                    :
                                    promocodes.map((promocode) => (
                                        <PromocodeItem key={promocode.id} promocode={promocode.promocode} bonus={promocode.bonus} status={promocode.status} />
                                    ))
                            }
                        </div>
                    </div>

                    <div className="w-[253px] h-[303px] bg-[#000A21] rounded-2xl mt-14 flex flex-col items-center">
                        <p className='font-[OB] text-[14px] text-transparent mt-4 z-30' style={{ whiteSpace: "normal", backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ЕЖЕДНЕВНЫЙ БОНУС</p>

                        <div className="h-[50%] w-full flex items-center justify-center relative">
                            <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute " style={{ boxShadow: "0px 0px 100px 40px rgba(0, 40, 184, 1)" }}></div>
                            <img src="../public/box.png" alt="" className='z-30' />
                            <img src="../public/coin10.svg" alt="" className='z-30 absolute right-12 bottom-24 ' />
                            <img src="../public/coin11.svg" alt="" className='z-30 absolute left-10 bottom-8' />

                        </div>
                        <div className="flex gap-2 z-30">
                            <div className="w-[114px] h-[40px] bg-black bg-opacity-[30%] rounded-xl">
                                <p className='text-[11px] text-[#848484] pl-3 mt-1'>День</p>
                                <p className='pl-3 text-[11px] font-[OB]'>{bonusNum + 1}</p>
                            </div>


                            <div className="w-[114px] h-[40px] bg-black bg-opacity-[30%] rounded-xl z-30">
                                <p className='text-[11px] text-[#848484] pl-3 mt-1'>{time == 0 ? "Ваш бонус" : "Откроется через:"}</p>
                                {
                                    time == 0 ?

                                        <p className='pl-3 text-[11px] font-[OB] flex items-center gap-1'>
                                            {bonusNum == 0 && "15"}
                                            {bonusNum == 1 && "25"}
                                            {bonusNum == 2 && "50"}
                                            {bonusNum == 3 && "75"}
                                            {bonusNum == 4 && "100"}
                                            {bonusNum == 5 && "120"}
                                            {bonusNum == 6 && "200-500"}
                                            <img src="../public/coin_bonus.png" alt="" className='h-[10px]' />
                                        </p>

                                        :

                                        <p className='text-[11px] font-[OB] pl-3'>
                                            {time}
                                        </p>

                                }
                            </div>
                        </div>
                        <button onClick={() => Bonus()} style={time == 0 ? { background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" } : { background: "#5c5c5c" }} disabled={time == 0 ? false : true} className={"w-[90%] text-[14px] mt-4 h-[30px] rounded-xl bg-opacity-80 flex items-center justify-center"}>
                            {
                                loading && bonusNum == 1 ?

                                    <div className='flex items-center justify-center'>
                                        <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                            <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                        </svg>
                                        Загрузка...
                                    </div>

                                    :
                                    <>
                                        {time == 0 && "Забрать"}
                                        {time !== 0 && (
                                            <img src="../public/zamok2.png" alt="" />
                                        )}
                                    </>
                            }
                        </button>

                    </div>

                    {
                        gamesAds.length === 0 ?

                            <div className="flex items-center justify-center z-50 relative w-[95%] flex-col mt-20">
                                <p className='z-10 font-[IJ] text-[20px] w-[80%] text-center' style={{ whiteSpace: "normal" }}>Тут могла быть ваша реклама</p>
                                <button className='z-10 font-[IJ] text-[12px] w-[80px] h-[30px] bg-[#9E1BC8] rounded-xl border-[#9E1BC8] border-[1px] border-opacity-70 mt-2' style={{ background: "url(../public/BBG.png)" }}>
                                    <Link to={"/help"}>
                                        ЗАКАЗАТЬ
                                    </Link>
                                </button>
                                <img src="../public/ad.png" alt="" className='absolute w-[95%] rounded-3xl' />
                            </div>

                            :

                            <div className="flex w-full items-center justify-center z-50 relative mt-20 flex-col">
                                {
                                    gamesAds.map((ad, index) => (

                                        <div key={index} className="flex w-[95vw] items-center justify-center z-50 relative h-[125px] mt-8 flex-col">
                                            <div className="relative z-10 flex items-center w-[384px] justify-between">
                                                <p className='ml-2 text-[14px] font-[OB] w-[30%] text-center' style={{ whiteSpace: "normal" }}>{ad.name}</p>
                                                <Link to={ad.link} className='flex items-center justify-center z-10 mr-4 font-[OB] text-[14px] w-[88px] h-[26px] rounded-3xl border-opacity-70' style={{ background: ad.color ? ad.color : "rgb(110, 0, 0)" }}>
                                                    Перейти
                                                </Link>
                                            </div>
                                            <img src={ad.background} alt="" className='absolute h-[125px] rounded-3xl' />
                                        </div>
                                    ))
                                }
                            </div>
                    }


                    <div className="flex flex-col items-center w-full">
                        <p className='font-[OEB] text-[30px] text-transparent mt-14' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>КЕЙСЫ</p>
                        <div className='flex flex-col items-center relative mt-20 w-full'>

                            <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[40%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 120px 110px rgba(0, 40, 184, 0.7)" }}></div>
                            <div className="absolute right-0"><img src="../public/right.svg" className='w-[48vw]' alt="" /></div>
                            <div className="absolute left-0"><img src="../public/left.svg" className='w-[48vw]' alt="" /></div>

                            <Link to={"/case/free"} className="flex flex-col items-center">
                                <img src="../public/free.png" className="h-[201px] transform transition-transform duration-300 ease-in-out hover:translate-y-[-15px] z-10" alt="" />
                                <p className='text-[24px] font-[OB] z-10 mt-5'>FREE</p>
                                <button className='bg-white z-10 mt-5 bg-opacity-40 px-2 py-1 rounded-lg font-[OSB] border border-white border-opacity-60 min-w-[70px] flex justify-center text-[20px]'>
                                    {
                                        cooldown == 0 ?
                                            <div className='flex items-center'>
                                                <p>0</p>
                                                <img src="../public/coin15.svg" className='h-[17px] w-[17px] ml-1 relative z-10' alt="" />
                                            </div>
                                            :
                                            `${cooldown}`
                                    }
                                </button>
                            </Link>
                        </div>

                        <p className='mt-16 w-[65%] text-center text-[12px] text-[OL]' style={{ whiteSpace: "normal" }}>Бесплатный кейс доступен для открытия два раза в сутки. Если не хотите ждать, ниже представлены платные кейсы, которые можно купить за брендкоины.</p>

                        <div className="w-full mt-44 relative flex justify-center">
                            <img src="../GameCasesL.png" alt="" className='absolute left-0 bottom-[-10vh] w-[40vw] ' />
                            <img src="../GameCasesR.png" alt="" className='absolute right-0 top-[-15vh] w-[40vw]' />
                            <div className="flex justify-between w-[70%] items-center flex-col gap-12">
                                <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[40%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 120px 110px rgba(0, 40, 184, 0.7)" }}></div>

                                <Carousel
                                    selectedItem={currentIndex}
                                    onChange={handleChange}
                                    showThumbs={false}
                                    showIndicators={false}
                                    showArrows={true}
                                    showStatus={false}
                                    className='w-[100vw]'
                                    renderArrowPrev={renderArrowPrev}
                                    renderArrowNext={renderArrowNext}
                                >
                                    {items.map((item) => (
                                        <div key={item.id} className="w-full h-auto flex justify-center">
                                            <Link to={`/case/${item.label.toLowerCase()}`} className="flex flex-col items-center relative w-[250px]">
                                                <img src={item.img} className="h-[201px] transform transition-transform duration-300 ease-in-out hover:translate-y-[-15px] z-10" alt={item.label} />
                                                <p className='text-[24px] font-[OB] z-10 mt-5'>{item.name}</p>
                                                <button className='bg-white z-10 mt-5 bg-opacity-40 w-[91px] py-1 rounded-lg font-[OSB] border border-white border-opacity-60 min-w-[70px] flex justify-center text-[20px]'>
                                                    <div className='flex items-center'>
                                                        <p>{item.price}</p>
                                                        <img src="../public/coin15.svg" className='h-[17px] w-[17px] ml-1 relative z-10' alt="" />
                                                    </div>
                                                </button>
                                            </Link>
                                        </div>
                                    ))}
                                </Carousel>

                                <div className="custom-pagination flex justify-center mt-4">
                                    {items.map((item, index) => (
                                        <button
                                            key={item.id}
                                            className={`pagination-dot ${currentIndex === index ? 'active' : ''}`}
                                            onClick={() => handleChange(index)}
                                        >
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className='font-[OB] text-[64px] text-transparent mt-44' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ИГРЫ</p>

                        <div className="flex flex-col gap-8 items-center mt-20">
                            <Link to={'/roulette'}
                            >
                                <img className='w-[80vw]' src="../public/roulettebuttonm.svg" alt="" />
                            </Link>
                            <Link to={'/miner'}
                            >
                                <img className='w-[80vw]' src="../public/minerbuttonm.svg" alt="" />
                            </Link>
                        </div>
                    </div>

                </div>

                :

                <div className='flex flex-col items-center pt-20 mt-5 pb-96 relative'>
                    <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[15vw] top-[34vh]" style={{ boxShadow: "0px 0px 130px 120px rgba(0, 40, 184, 1)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute right-[15vw] top-[50vh]" style={{ boxShadow: "0px 0px 130px 120px rgba(0, 40, 184, 1)" }}></div>
                    <img src="../public/clever.png" alt="" className='absolute left-[10vw]' />
                    <img src="../public/clever2.png" alt="" className='absolute right-[10vw] top-[25vh]' />
                    <img src="../public/priz.png" alt="" className='absolute left-[2vw] top-[40vh]' />
                    <img src="../public/priz2.png" alt="" className='absolute right-[5vw] top-[40vh]' />


                    {showModal && <LoginModal onClose={closeModal} />}
                    <div className="relative">
                        <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute top-[180%] left-[50%] " style={{ boxShadow: "0px 0px 400px 300px #000000" }}></div>
                        <p className='font-[OB] text-[56px] text-transparent z-20 relative' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>BRAND GAMES</p>
                    </div>
                    <div className="flex flex-col items-center mt-10 z-20">
                        <p className='text-center text-[20px] w-[40%] z-20' style={{ whiteSpace: "normal" }}>Брендкоины — это ваши накопленные электронные деньги на нашем сайте.</p>
                        <p className='text-center text-[20px] w-[40%] mt-7 z-20' style={{ whiteSpace: "normal" }}>Их можно поменять на реальные деньги до 2000 тенге в виде скидки у некоторых наших партнёров. После обмена ваши деньги сгорают.</p>
                        <p className='text-center text-[20px] w-[40%] mt-7 z-20' style={{ whiteSpace: "normal" }}>Баланс будет отображаться в личном кабинете.</p>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center">
                        <p className='font-[OB] text-[64px] text-transparent mt-44' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ПАРТНЕРЫ</p>
                        <p className='text-[24px]'>Здесь можно обменять брендкоины и получить призы</p>
                        <div className="flex gap-6 mt-10">
                            <Link to={'/shop/37'} className='shop'>
                                <img src="../public/skitty.png" alt="" className='w-[250px] h-[280px]' />
                            </Link>
                            <Link to={'/shop/96'} className='shop'>
                                <img src="../public/vinci.png" alt="" className='w-[250px] h-[280px]' />
                            </Link>
                            <Link to={'/shop/131'} className='shop'>
                                <img src="../public/line.png" alt="" className='w-[250px] h-[280px]' />
                            </Link>
                            <Link to={'/shop/3'} className='shop'>
                                <img src="../public/garage.png" alt="" className='w-[250px] h-[280px]' />
                            </Link>
                            <Link to={'/shop/100'} className='shop'>
                                <img src="../public/lee.png" alt="" className='w-[250px] h-[280px]' />
                            </Link>

                        </div>
                    </div>

                    <div className="w-[70%] h-[460px] bg-[#080808] mt-24 rounded-[20px] flex justify-between min-w-[1200px]">
                        <div className="mt-10 ml-12 min-w-[676px]">
                            <div className="flex justify-between items-center">
                                <p className="text-[32px] font-[OB] text-transparent flex items-center" style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>Баланс: {balance} <img src="../public/cointr.svg" alt="" className='h-6 ml-2' /></p>
                                <button
                                    onClick={() => setShowTransfersModal(true)}
                                    className="px-4 py-2 font-[OSB] text-[20px] text-[#0600B7]"
                                >
                                    Показать все
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-[10px] mt-8">
                                {
                                    transfers.length === 0 ?

                                        <div className="flex items-center justify-center h-[200px] w-full">
                                            <p className='text-white font-[OB] text-[32px]'>Пусто</p>
                                        </div>

                                        :

                                        transfers.sort((a, b) => a.position_numer - b.position_numer)
                                            .slice(0, 8)
                                            .map(transfer => (
                                                <TransferItem
                                                    key={transfer.id}
                                                    name={transfer.key}
                                                    id_user={transfer.id_user}
                                                    price={transfer.price}
                                                    date={transfer.date}
                                                />
                                            ))
                                }
                            </div>

                            {showTransfersModal && (
                                <div className="fixed inset-0 flex items-center justify-center" style={{ position: 'fixed', zIndex: 9999 }}>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
                                    <div className="relative bg-[#232222] bg-opacity-20 backdrop-blur-3xl p-8 rounded-xl w-[80%] max-h-[80vh] overflow-y-auto">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-[OB]">История баланса</h2>
                                            <button
                                                onClick={() => setShowTransfersModal(false)}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="flex gap-3 flex-wrap">
                                            {transfers.sort((a, b) => a.position_numer - b.position_numer)
                                                .map(transfer => (
                                                    <TransferItem
                                                        key={transfer.id}
                                                        name={transfer.key}
                                                        id_user={transfer.id_user}
                                                        price={transfer.price}
                                                        date={transfer.date}
                                                    />
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-10 mr-10 min-w-[425px]">
                            <div className="flex justify-between items-center">
                                <p className="text-[32px] font-[OB] text-transparent flex items-center" style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>Промокоды</p>
                                <button
                                    onClick={() => setShowPromocodesModal(true)}
                                    className="px-4 py-2 font-[OSB] text-[20px] text-[#0600B7]"
                                >
                                    Показать все
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-[10px] mt-8">
                                {
                                    promocodes.length === 0 ?

                                        <div className="flex items-center justify-center h-[200px] w-full">
                                            <p className='text-white font-[OB] text-[32px]'>Пусто</p>
                                        </div>
                                        :
                                        promocodes.slice(0, 6).map((promocode) => (
                                            <PromocodeItem key={promocode.id} promocode={promocode.promocode} bonus={promocode.bonus} status={promocode.status} />
                                        ))
                                }
                            </div>
                        </div>

                        {showPromocodesModal && (
                            <div className="fixed inset-0 flex items-center justify-center" style={{ position: 'fixed', zIndex: 9999 }}>
                                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
                                <div className="relative bg-[#232222] bg-opacity-20 backdrop-blur-3xl p-8 rounded-xl w-[80%] max-h-[80vh] overflow-y-auto">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-[OB]">История промокодов</h2>
                                        <button
                                            onClick={() => setShowPromocodesModal(false)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="flex gap-5 flex-wrap">
                                        {promocodes.map((promocode) => (
                                            <PromocodeItem key={promocode.id} promocode={promocode.promocode} bonus={promocode.bonus} status={promocode.status} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-[70%] h-[320px] mt-32 bg-[#000A21] rounded-3xl flex justify-between z-30">
                        <div className="w-[20%] bg-[#000A21] left-0 h-full rounded-l-3xl relative flex justify-between items-center flex-col">
                            <p className='font-[OB] text-[25px] text-transparent mt-9 ml-4' style={{ whiteSpace: "normal", backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ЕЖЕДНЕВНЫЙ БОНУС</p>
                            <Link to={`/profile/${user ? user.id : "#"}`} className='z-50 mb-5 bg-black bg-opacity-40 backdrop-blur-lg text-[14px] w-44 h-7 flex justify-center items-center rounded-full font-[OSB]'>Проверить баланс</Link>
                            <img src="../public/present.png" alt="" className='bottom-0 left-0 absolute' />
                        </div>
                        <div className="w-[60%] h-full bg-[#000A21] overflow-x-scroll flex items-center justify-start gap-6 ">
                            <div className="border h-[250px] min-w-[182px] border-dashed border-[#888888] rounded-2xl flex flex-col items-center">
                                <div className="h-[80%] w-full flex items-center flex-col justify-between mt-3">
                                    <p className=' font-[OB]'>День 1</p>
                                    <div className="flex items-center flex-col">
                                        <img src="../public/coin_bonus.png" alt="" />
                                        <p className='font-[OB] mt-3'>15</p>
                                    </div>
                                    <button onClick={() => Bonus()} style={bonusNum == 0 && time == 0 ? { background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' } : { background: "#A5A5A5" }} disabled={bonusNum == 0 && time == 0 ? false : true} className={`${loading && bonusNum == 0 ? "w-[130px]" : "w-[85px]"} text-[14px] h-[30px] bg-[#A5A5A5] rounded-xl bg-opacity-80 flex items-center justify-center`}>
                                        {
                                            loading && bonusNum == 0 ?

                                                <div className='flex items-center justify-center'>
                                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                    </svg>
                                                    Загрузка...
                                                </div>

                                                :
                                                <>
                                                    {bonusNum == 0 && time == 0 && "Забрать"}
                                                    {bonusNum > 0 && "Открыто"}
                                                    {bonusNum < 0 && <img src="../public/zamok2.png" alt="" />}
                                                    {bonusNum === 0 && time !== 0 && (
                                                        <img src="../public/zamok2.png" alt="" />
                                                    )}
                                                </>
                                        }
                                    </button>
                                </div>
                                {bonusNum === 0 && time !== 0 && (
                                    <p className='mt-1'>{time}</p>
                                )}
                            </div>
                            <div className="border h-[250px] min-w-[182px] border-dashed border-[#888888] rounded-2xl flex flex-col items-center">
                                <div className="h-[80%] w-full flex items-center flex-col justify-between mt-3">
                                    <p className=' font-[OB]'>День 2</p>
                                    <div className="flex items-center flex-col">
                                        <img src="../public/coin_bonus.png" alt="" />
                                        <p className='font-[OB] mt-3'>25</p>
                                    </div>
                                    <button onClick={() => Bonus()} style={bonusNum == 1 && time == 0 ? { background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' } : { background: "#A5A5A5" }} disabled={bonusNum == 1 && time == 0 ? false : true} className={`${loading && bonusNum == 1 ? "w-[130px]" : "w-[85px]"} text-[14px] h-[30px] bg-[#A5A5A5] rounded-xl bg-opacity-80 flex items-center justify-center`}>
                                        {
                                            loading && bonusNum == 1 ?

                                                <div className='flex items-center justify-center'>
                                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                    </svg>
                                                    Загрузка...
                                                </div>

                                                :
                                                <>
                                                    {bonusNum == 1 && time == 0 && "Забрать"}
                                                    {bonusNum > 1 && "Открыто"}
                                                    {bonusNum < 1 && <img src="../public/zamok2.png" alt="" />}
                                                    {bonusNum === 1 && time !== 0 && (
                                                        <img src="../public/zamok2.png" alt="" />
                                                    )}
                                                </>
                                        }
                                    </button>
                                </div>
                                {bonusNum === 1 && time !== 0 && (
                                    <p className='mt-1'>{time}</p>
                                )}
                            </div>
                            <div className="border h-[250px] min-w-[182px] border-dashed border-[#888888] rounded-2xl flex flex-col items-center">
                                <div className="h-[80%] w-full flex items-center flex-col justify-between mt-3">
                                    <p className=' font-[OB]'>День 3</p>
                                    <div className="flex items-center flex-col">
                                        <img src="../public/coin_bonus.png" alt="" />
                                        <p className='font-[OB] mt-3'>50</p>
                                    </div>
                                    <button onClick={() => Bonus()} style={bonusNum == 2 && time == 0 ? { background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' } : { background: "#A5A5A5" }} disabled={bonusNum == 2 && time == 0 ? false : true} className={`${loading && bonusNum == 2 ? "w-[130px]" : "w-[85px]"} text-[14px] h-[30px] bg-[#A5A5A5] rounded-xl bg-opacity-80 flex items-center justify-center`}>
                                        {
                                            loading && bonusNum == 2 ?

                                                <div className='flex items-center justify-center'>
                                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                    </svg>
                                                    Загрузка...
                                                </div>

                                                :
                                                <>
                                                    {bonusNum == 2 && time == 0 && "Забрать"}
                                                    {bonusNum > 2 && "Открыто"}
                                                    {bonusNum < 2 && <img src="../public/zamok2.png" alt="" />}
                                                    {bonusNum === 2 && time !== 0 && (
                                                        <img src="../public/zamok2.png" alt="" />
                                                    )}
                                                </>
                                        }
                                    </button>
                                </div>
                                {bonusNum === 2 && time !== 0 && (
                                    <p className='mt-1'>{time}</p>
                                )}
                            </div>
                            <div className="border h-[250px] min-w-[182px] border-dashed border-[#888888] rounded-2xl flex flex-col items-center">
                                <div className="h-[80%] w-full flex items-center flex-col justify-between mt-3">
                                    <p className=' font-[OB]'>День 4</p>
                                    <div className="flex items-center flex-col">
                                        <img src="../public/coin_bonus.png" alt="" />
                                        <p className='font-[OB] mt-3'>75</p>
                                    </div>
                                    <button onClick={() => Bonus()} disabled={bonusNum == 3 && time == 0 ? false : true} style={bonusNum == 3 && time == 0 ? { background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' } : { background: "#A5A5A5" }} className={`${loading && bonusNum == 3 ? "w-[130px]" : "w-[85px]"} text-[14px] h-[30px] bg-[#A5A5A5] rounded-xl bg-opacity-80 flex items-center justify-center`}>
                                        {
                                            loading && bonusNum == 3 ?

                                                <div className='flex items-center justify-center'>
                                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                    </svg>
                                                    Загрузка...
                                                </div>

                                                :
                                                <>
                                                    {bonusNum == 3 && time == 0 && "Забрать"}
                                                    {bonusNum > 3 && "Открыто"}
                                                    {bonusNum < 3 && <img src="../public/zamok2.png" alt="" />}
                                                    {bonusNum === 3 && time !== 0 && (
                                                        <img src="../public/zamok2.png" alt="" />
                                                    )}
                                                </>
                                        }
                                    </button>
                                </div>
                                {bonusNum === 3 && time !== 0 && (
                                    <p className='mt-1'>{time}</p>
                                )}
                            </div>
                            <div className="border h-[250px] min-w-[182px] border-dashed border-[#888888] rounded-2xl flex flex-col items-center">
                                <div className="h-[80%] w-full flex items-center flex-col justify-between mt-3">
                                    <p className=' font-[OB]'>День 5</p>
                                    <div className="flex items-center flex-col">
                                        <img src="../public/coin_bonus.png" alt="" />
                                        <p className='font-[OB] mt-3'>100</p>
                                    </div>
                                    <button onClick={() => Bonus()} style={bonusNum == 4 && time == 0 ? { background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' } : { background: "#A5A5A5" }} disabled={bonusNum == 4 && time == 0 ? false : true} className={`${loading && bonusNum == 4 ? "w-[130px]" : "w-[85px]"} text-[14px] h-[30px] bg-[#A5A5A5] rounded-xl bg-opacity-80 flex items-center justify-center`}>
                                        {
                                            loading && bonusNum == 4 ?

                                                <div className='flex items-center justify-center'>
                                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                    </svg>
                                                    Загрузка...
                                                </div>

                                                :
                                                <>
                                                    {bonusNum == 4 && time == 0 && "Забрать"}
                                                    {bonusNum > 4 && "Открыто"}
                                                    {bonusNum < 4 && <img src="../public/zamok2.png" alt="" />}
                                                    {bonusNum === 4 && time !== 0 && (
                                                        <img src="../public/zamok2.png" alt="" />
                                                    )}
                                                </>
                                        }
                                    </button>
                                </div>
                                {bonusNum === 4 && time !== 0 && (
                                    <p className='mt-1'>{time}</p>
                                )}
                            </div>
                            <div className="border h-[250px] min-w-[182px] border-dashed border-[#888888] rounded-2xl flex flex-col items-center" >
                                <div className="h-[80%] w-full flex items-center flex-col justify-between mt-3">
                                    <p className=' font-[OB]'>День 6</p>
                                    <div className="flex items-center flex-col">
                                        <img src="../public/coin_bonus.png" alt="" />
                                        <p className='font-[OB] mt-3'>120</p>
                                    </div>
                                    <button onClick={() => Bonus()} style={bonusNum == 5 && time == 0 ? { background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' } : { background: "#A5A5A5" }} disabled={bonusNum == 5 && time == 0 ? false : true} className={`${loading && bonusNum == 5 ? "w-[130px]" : "w-[85px]"} text-[14px] h-[30px] bg-[#A5A5A5] rounded-xl bg-opacity-80 flex items-center justify-center`}>
                                        {
                                            loading && bonusNum == 5 ?

                                                <div className='flex items-center justify-center'>
                                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                    </svg>
                                                    Загрузка...
                                                </div>

                                                :
                                                <>
                                                    {bonusNum == 5 && time == 0 && "Забрать"}
                                                    {bonusNum > 5 && "Открыто"}
                                                    {bonusNum < 5 && <img src="../public/zamok2.png" alt="" />}
                                                    {bonusNum === 5 && time !== 0 && (
                                                        <img src="../public/zamok2.png" alt="" />
                                                    )}
                                                </>

                                        }
                                    </button>
                                </div>
                                {bonusNum === 5 && time !== 0 && (
                                    <p className='mt-1'>{time}</p>
                                )}
                            </div>
                        </div>
                        <div className="w-[20%] bg-[#000A21] right-0 h-full rounded-r-3xl flex items-center justify-center">
                            <div className="h-[250px] min-w-[182px] rounded-2xl bg-[url(../public/ShopItemBG.svg)] mb-[17px] w-[63px] flex flex-col items-center">
                                <div className="h-[80%] w-full flex items-center flex-col justify-between mt-3">
                                    <p className='text-[#6F6F6F] font-[OB]'>День 7</p>
                                    <div className="flex items-center flex-col">
                                        <img src="../public/coin_bonus.png" alt="" />
                                        <p className='font-[OB] text-[#606060] mt-3'>200-500</p>
                                    </div>
                                    <button onClick={() => Bonus()} style={bonusNum == 6 && time == 0 ? { background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' } : { background: "#A5A5A5" }} disabled={bonusNum == 6 || time == 0 ? false : true} className={`${loading && bonusNum == 6 ? "w-[130px]" : "w-[85px]"} text-[14px] h-[30px] bg-[#595858] rounded-xl bg-opacity-80 flex items-center justify-center`}>
                                        {
                                            loading && bonusNum == 6 ?

                                                <div className='flex items-center justify-center'>
                                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                    </svg>
                                                    Загрузка...
                                                </div>

                                                :
                                                <>
                                                    {bonusNum == 6 && time == 0 && "Забрать"}
                                                    {bonusNum < 6 && <img src="../public/zamok2.png" alt="" />}
                                                    {bonusNum === 6 && time !== 0 && (
                                                        <img src="../public/zamok2.png" alt="" />
                                                    )}
                                                </>
                                        }
                                    </button>
                                </div>
                                {bonusNum === 6 && time !== 0 && (
                                    <p className='mt-1'>{time}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <>
                        {
                            gamesAds.length === 0 ?

                                <div className="flex w-full items-center justify-center z-50 relative h-[450px] mt-20 flex-col">
                                    <p className='z-10 font-[IJ] text-[64px] w-[40%] text-center' style={{ whiteSpace: "normal" }}>Тут могла быть ваша реклама</p>
                                    <button className='z-10 font-[IJ] text-[28px] w-[255px] h-[76px] bg-[#9E1BC8] rounded-3xl border-[#9E1BC8] border-[1px] border-opacity-70' style={{ background: "url(../public/BBG.png)" }}>
                                        <Link to={"/help"}>
                                            ЗАКАЗАТЬ
                                        </Link>
                                    </button>
                                    <img src="../public/ad.png" alt="" className='absolute h-[450px] rounded-3xl' />
                                </div>

                                :

                                <div className="flex w-full items-center justify-center z-50 relative mt-20 flex-col gap-5">
                                    {
                                        gamesAds.map((ad, index) => (
                                            <div key={index} className="relative z-10 flex items-center w-[1106px] justify-between h-[361px] mb-4">
                                                <p className='ml-6 text-[40px] font-[OB] w-[30%] text-center' style={{ whiteSpace: "normal" }}>{ad.name}</p>
                                                <button className='z-10 mr-16 font-[OB] text-[30px] w-[255px] h-[76px] rounded-3xl border-opacity-70' style={{ background: ad.color }}>
                                                    <a href={ad.link}>
                                                        Перейти
                                                    </a>
                                                </button>
                                                <img src={ad.background} alt="" className='absolute h-full rounded-3xl' />
                                            </div>
                                        ))
                                    }
                                </div>
                        }
                    </>


                    <div className="flex flex-col items-center w-full">
                        <p className='font-[OB] text-[56px] text-transparent mt-28' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>КЕЙСЫ</p>
                        <div className='flex flex-col items-center relative mt-20 w-full'>

                            <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[40%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 120px 110px rgba(0, 40, 184, 0.7)" }}></div>
                            <div className="absolute right-0 top-[-120%]"><img src="../public/right.svg" className='w-[48vw]' alt="" /></div>
                            <div className="absolute left-0 top-[-110%]"><img src="../public/left.svg" className='w-[48vw]' alt="" /></div>

                            <Link to={"/case/free"} className="flex flex-col items-center">
                                <img src="../public/free.png" className="h-[201px] transform transition-transform duration-300 ease-in-out hover:translate-y-[-15px] z-10" alt="" />
                                <p className='text-[24px] font-[OB] z-10 mt-5'>FREE</p>
                                <button className='bg-white z-10 mt-5 bg-opacity-40 px-2 py-1 rounded-lg font-[OSB] border border-white border-opacity-60 min-w-[70px] flex justify-center text-[20px]'>
                                    {
                                        cooldown == 0 ?
                                            <div className='flex items-center'>
                                                <p>0</p>
                                                <img src="../public/coin15.svg" className='h-[17px] w-[17px] ml-1 relative z-10' alt="" />
                                            </div>
                                            :
                                            `${cooldown}`
                                    }
                                </button>
                            </Link>
                        </div>

                        <p className='mt-36 w-[65%] text-center text-[24px]' style={{ whiteSpace: "normal" }}>Бесплатный кейс доступен для открытия два раза в сутки. Если не хотите ждать, ниже представлены платные кейсы, которые можно купить за брендкоины.</p>

                        <div className="w-full mt-44 relative flex justify-center">
                            <img src="../GameCasesL.png" alt="" className='absolute left-0 bottom-[-25vh]' />
                            <img src="../GameCasesR.png" alt="" className='absolute right-0 top-[-25vh]' />
                            <div className="flex justify-between w-[70%] items-center">
                                <Link to={"/case/general"} className="flex flex-col items-center relative">
                                    <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[40%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 120px 110px rgba(0, 40, 184, 0.7)" }}></div>
                                    <img src="../public/general.png" className="h-[201px] transform transition-transform duration-300 ease-in-out hover:translate-y-[-15px] z-10" alt="" />
                                    <p className='text-[24px] font-[OB] z-10 mt-5'>ОБЫЧНЫЙ</p>
                                    <button className='bg-white z-10 mt-5 bg-opacity-40 w-[91px] py-1 rounded-lg font-[OSB] border border-white border-opacity-60 min-w-[70px] flex justify-center text-[20px]'>
                                        <div className='flex items-center'>
                                            <p>250</p>
                                            <img src="../public/coin15.svg" className='h-[17px] w-[17px] ml-1 relative z-10' alt="" />
                                        </div>
                                    </button>
                                </Link>
                                <Link to={"/case/rare"} className="flex flex-col items-center relative">
                                    <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[40%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 120px 110px rgba(0, 40, 184, 0.7)" }}></div>
                                    <img src="../public/rare.png" className="h-[201px] transform transition-transform duration-300 ease-in-out hover:translate-y-[-15px] z-10" alt="" />
                                    <p className='text-[24px] font-[OB] z-10 mt-5'>РЕДКИЙ</p>
                                    <button className='bg-white z-10 mt-5 bg-opacity-40 w-[91px] py-1 rounded-lg font-[OSB] border border-white border-opacity-60 min-w-[70px] flex justify-center text-[20px]'>
                                        <div className='flex items-center'>
                                            <p>500</p>
                                            <img src="../public/coin15.svg" className='h-[17px] w-[17px] ml-1 relative z-10' alt="" />
                                        </div>
                                    </button>
                                </Link>
                                <Link to={"/case/legendary"} className="flex flex-col items-center relative">
                                    <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[40%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 120px 110px rgba(0, 40, 184, 0.7)" }}></div>
                                    <img src="../public/legendary.png" className="h-[201px] transform transition-transform duration-300 ease-in-out hover:translate-y-[-15px] z-10" alt="" />
                                    <p className='text-[24px] font-[OB] z-10 mt-5'>ЛЕГЕНДАРНЫЙ</p>
                                    <button className='bg-white z-10 mt-5 bg-opacity-40 w-[91px] py-1 rounded-lg font-[OSB] border border-white border-opacity-60 min-w-[70px] flex justify-center text-[20px]'>
                                        <div className='flex items-center'>
                                            <p>1000</p>
                                            <img src="../public/coin15.svg" className='h-[17px] w-[17px] ml-1 relative z-10' alt="" />
                                        </div>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className='font-[OB] text-[64px] text-transparent mt-44' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ИГРЫ</p>

                        <div className="flex gap-14 items-center mt-20">
                            <Link to={'/roulette'}
                                className="hover-effect rounded-3xl"
                            >
                                <img src="../public/roulettebutton.svg" alt="" />
                            </Link>
                            <Link to={'/miner'}
                                className="hover-effect rounded-3xl"
                            >
                                <img src="../public/minerbutton.svg" alt="" />
                            </Link>
                        </div>
                    </div>

                </div>

            }
        </>

    )
}

export default Games