import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AuthService } from '../services/auth.service';
import "./rarecase.css"
import LoginModal from './LoginModal';
import { useAuth } from '../hooks/useAuth';
import { useMediaQuery } from 'react-responsive';

const FreeCase = () => {
    const dispatch = useDispatch();
    const [cooldown, setCooldown] = useState()
    const [loadind, setLoadind] = useState()
    const [open, setOpen] = useState(false)
    const [animationLine, setAnimationLine] = useState()
    const user = useSelector((state) => state.user.user);
    const [finalPrize, setFinalPrize] = useState(null);
    const isAuth = useAuth();
    const [showModal, setShowModal] = useState(false);


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
                setCooldown(data.remaining_time);
            } catch (error) {
                console.error('Ошибка при получении:', error);
            }
        }
    };

    const prizes = {
        "50 tokens": "../public/50_coins.png",
        "80 tokens": "../public/80_coins.png",
        "100 tokens": "../public/100_coins.png",
        "150 tokens": "../public/150_coins.png",
        "200 tokens": "../public/200_coins.png",
        "250 tokens": "../public/250_coins.png",
        "300 tokens": "../public/300_coins.png",
        "5%": "../public/5_promo.png",
        "10%": "../public/10_promo.png",
        "1G SORT": "../public/1_free_org.png",
        "1G MEOW": "../public/1_free_him.png"
    }

    const GetPrize = async () => {
        if (user && user.id) {
            setLoadind(true);
            try {
                const response = await fetch('/bonus/get_bonus/free', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ID: user.id }),
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();

                let images = new Array(70).fill(null);
                images[64] = prizes[`${data.BONUS}`];

                const otherPrizes = Object.values(prizes);

                for (let i = 0; i < images.length; i++) {
                    if (images[i] === null) {
                        const randomIndex = Math.floor(Math.random() * otherPrizes.length);
                        images[i] = otherPrizes[randomIndex];
                    }
                }

                setOpen(true);
                setAnimationLine(images);
                setFinalPrize(prizes[`${data.BONUS}`]);

                const handleAnimationEnd = () => {
                    setTimeout(() => {
                        setOpen(false);
                        GetCooldown();
                        setLoadind(false);
                    }, 1000);

                    document.removeEventListener('animationend', handleAnimationEnd);
                };

                document.addEventListener('animationend', handleAnimationEnd);

            } catch (error) {
                console.error('Ошибка при получении бонуса:', error);
            }
        }
    };

    useEffect(() => {
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

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <>
            {
                isMobile ?

                    <div className='flex flex-col items-center justify-center mb-20'>
                        {showModal && <LoginModal onClose={closeModal} />}
                        <img src="../public/FreeCaseText.png" className='h-[40px] mt-16 z-50' alt="" />

                        {
                            open ?
                                <div className="flex items-center justify-center w-[370px] h-[163px] border border-white rounded-2xl overflow-hidden relative mt-10">
                                    <img src="../public/FreeArrow.png" className='absolute right-[50%] top-0 translate-x-[50%] z-10' alt="" />
                                    <div className="flex items-center gap-2 animation2">
                                        {
                                            animationLine.map((src, index) => (
                                                <img key={index} src={src} className={"h-[130px]"} alt='' />
                                            ))
                                        }
                                    </div>
                                </div>
                                :
                                <div className="relative w-full flex flex-col items-center justify-center">
                                    <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 150px 140px rgba(0, 40, 184, 0.7)" }}></div>
                                    <img src="../public/FreeRight.png" className='absolute right-0 w-[35%]' alt="" />
                                    <img src="../public/FreeLeft.png" className='absolute left-0 w-[35%]' alt="" />

                                    {finalPrize ? (
                                        <>
                                            <img src={finalPrize} className="h-[140px] mt-20 transform transition-transform duration-300 ease-in-out z-10" alt="" />
                                            {finalPrize == "../public/200_coins.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}
                                            {finalPrize == "../public/150_coins.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}
                                            {finalPrize == "../public/100_coins.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}
                                            {finalPrize == "../public/80_coins.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}
                                            {finalPrize == "../public/50_coins.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}

                                            {finalPrize == "../public/10_promo.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[60px]'></img>}
                                            {finalPrize == "../public/5_promo.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[60px]'></img>}
                                            {finalPrize == "../public/250_coins.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[60px]'></img>}
                                            {finalPrize == "../public/300_coins.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[60px]'></img>}

                                            {finalPrize == "../public/1_free_him.png" && <img src="../public/ex.png" className='z-50 relative mt-4 h-[60px]'></img>}
                                            {finalPrize == "../public/1_free_org.png" && <img src="../public/ex.png" className='z-50 relative mt-4 h-[60px]'></img>}
                                            <button onClick={() => setFinalPrize(false)} className='w-[200px] h-[60px]  rounded-3xl mt-8 font-[OB] text-[18px]' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>Получить</button>
                                        </>
                                    ) : (
                                        <img src="../public/free.png" className="h-[175px] mt-12 transform transition-transform duration-300 ease-in-out z-10" alt="" />
                                    )}
                                </div>
                        }

                        {!finalPrize ?

                            <>

                                {
                                    cooldown == 0 ?

                                        <button onClick={GetPrize} disabled={loadind} className='w-[200px] h-[50px]  rounded-3xl mt-16 font-[OB] text-[16px]' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>
                                            {
                                                loadind ?

                                                    <div className='flex items-center justify-center'>
                                                        <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                            <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                        </svg>
                                                        ОТКРЫТИЕ...
                                                    </div>

                                                    :

                                                    "ОТКРЫТЬ"
                                            }
                                        </button>

                                        :

                                        <button disabled={true} className='cursor-not-allowed bg-white z-10 mt-16 bg-opacity-40 w-[230px] h-[50px]  items-center  rounded-lg font-[OSB] border border-white border-opacity-60 min-w-[70px] flex justify-center text-[24px]'>
                                            {cooldown}
                                        </button>
                                }

                            </>

                            :

                            <></>


                        }

                        <p className='text-[24px] mt-28 font-[LZ] text-center w-[70%]' style={{ whiteSpace: "normal" }}>СОДЕРЖИМОЕ КЕЙСА</p>

                        <div className='mt-8'>
                            <div className="flex justify-center flex-wrap">
                                <img className='h-[139px] w-[139px]' src={prizes["1G MEOW"]} alt="1G free him" />
                                <img className='h-[139px] w-[139px] ml-8' src={prizes["1G SORT"]} alt="1G free org" />
                                <img className='h-[139px] w-[139px] mt-6' src={prizes["10%"]} alt="10% promo" />
                                <img className='h-[139px] w-[139px] ml-3 mt-6' src={prizes["5%"]} alt="5% promo" />
                                <img className='h-[139px] w-[139px] mt-6' src={prizes["300 tokens"]} alt="300 coins" />
                                <img className='h-[139px] w-[139px] ml-8 mt-6' src={prizes["250 tokens"]} alt="250 coins" />
                                <img className='h-[139px] w-[139px] mt-6' src={prizes["200 tokens"]} alt="200 coins" />
                                <img className='h-[139px] w-[139px] ml-8 mt-6' src={prizes["150 tokens"]} alt="150 coins" />
                                <img className='h-[139px] w-[139px] mt-6' src={prizes["100 tokens"]} alt="100 coins" />
                                <img className='h-[139px] w-[139px] ml-8 mt-6' src={prizes["80 tokens"]} alt="80 coins" />
                                <img className='h-[139px] w-[139px] mt-6' src={prizes["50 tokens"]} alt="50 coins" />
                            </div>

                        </div>
                    </div>

                    :

                    <div className='flex flex-col items-center justify-center mb-20'>
                        {showModal && <LoginModal onClose={closeModal} />}
                        <img src="../public/FreeCaseText.png" className='h-[96px] mt-32' alt="" />

                        {
                            open ?
                                <div className="flex items-center justify-center w-[1350px] h-[300px] border border-white rounded-2xl overflow-hidden relative mt-10">
                                    <img src="../public/FreeArrow.png" className='absolute right-[50%] top-0 translate-x-[50%] z-10' alt="" />
                                    <div className="flex items-center gap-4 animation">
                                        {
                                            animationLine.map((src, index) => (
                                                <img key={index} src={src} className="h-[240px]" alt='' />
                                            ))
                                        }
                                    </div>
                                </div>
                                :
                                <div className="relative w-full flex flex-col items-center justify-center">
                                    <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 150px 140px rgba(0, 40, 184, 0.7)" }}></div>
                                    <img src="../public/FreeRight.png" className='absolute right-0 w-[35%]' alt="" />
                                    <img src="../public/FreeLeft.png" className='absolute left-0 w-[35%]' alt="" />

                                    {finalPrize ? (
                                        <>
                                            <img src={finalPrize} className="h-[301px] mt-20 transform transition-transform duration-300 ease-in-out z-10" alt="" />
                                            {finalPrize == "../public/200_coins.png" && <img src="../public/stand.png" className='z-50 relative mt-8'></img>}
                                            {finalPrize == "../public/150_coins.png" && <img src="../public/stand.png" className='z-50 relative mt-8'></img>}
                                            {finalPrize == "../public/100_coins.png" && <img src="../public/stand.png" className='z-50 relative mt-8'></img>}
                                            {finalPrize == "../public/80_coins.png" && <img src="../public/stand.png" className='z-50 relative mt-8'></img>}
                                            {finalPrize == "../public/50_coins.png" && <img src="../public/stand.png" className='z-50 relative mt-8'></img>}

                                            {finalPrize == "../public/10_promo.png" && <img src="../public/red.png" className='z-50 relative mt-8'></img>}
                                            {finalPrize == "../public/5_promo.png" && <img src="../public/red.png" className='z-50 relative mt-8'></img>}
                                            {finalPrize == "../public/250_coins.png" && <img src="../public/red.png" className='z-50 relative mt-8'></img>}
                                            {finalPrize == "../public/300_coins.png" && <img src="../public/red.png" className='z-50 relative mt-8'></img>}

                                            {finalPrize == "../public/1_free_him.png" && <img src="../public/ex.png" className='z-50 relative mt-8'></img>}
                                            {finalPrize == "../public/1_free_org.png" && <img src="../public/ex.png" className='z-50 relative mt-8'></img>}
                                            <button onClick={() => setFinalPrize(false)} className='w-[300px] h-[60px]  rounded-3xl mt-16 font-[OB] text-[20px]' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>Получить</button>
                                        </>
                                    ) : (
                                        <img src="../public/free.png" className="h-[301px] mt-20 transform transition-transform duration-300 ease-in-out z-10" alt="" />
                                    )}
                                </div>
                        }

                        {!finalPrize ?

                            <>

                                {
                                    cooldown == 0 ?

                                        <button onClick={GetPrize} disabled={loadind} className='w-[300px] h-[60px]  rounded-3xl mt-16 font-[OB] text-[20px]' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}>
                                            {
                                                loadind ?

                                                    <div className='flex items-center justify-center'>
                                                        <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                                            <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                                        </svg>
                                                        ОТКРЫТИЕ...
                                                    </div>

                                                    :

                                                    "ОТКРЫТЬ"
                                            }
                                        </button>

                                        :

                                        <button disabled={true} className='cursor-not-allowed bg-white z-10 mt-16 bg-opacity-40 w-[230px] h-[50px]  items-center  rounded-lg font-[OSB] border border-white border-opacity-60 min-w-[70px] flex justify-center text-[24px]'>
                                            {cooldown}
                                        </button>
                                }

                            </>

                            :

                            <></>


                        }

                        <p className='text-[56px] mt-28 font-[LZ]'>СОДЕРЖИМОЕ КЕЙСА</p>

                        <div className='mt-24'>
                            <div className="flex justify-center">
                                <img className='h-[250px] w-[250px]' src={prizes["1G MEOW"]} alt="1G free him" />
                                <img className='h-[250px] w-[250px] ml-20' src={prizes["1G SORT"]} alt="1G free org" />
                                <img className='h-[270px] w-[270px] mr-11 ml-16' src={prizes["10%"]} alt="10% promo" />
                                <img className='h-[270px] w-[270px]' src={prizes["5%"]} alt="5% promo" />
                            </div>

                            <div className="flex justify-center mt-20">
                                <img className='h-[250px] w-[250px] ' src={prizes["300 tokens"]} alt="300 coins" />
                                <img className='h-[250px] w-[250px] ml-20' src={prizes["250 tokens"]} alt="250 coins" />
                                <img className='h-[250px] w-[250px] ml-20' src={prizes["200 tokens"]} alt="200 coins" />
                            </div>

                            <div className="flex justify-center mt-20">
                                <img className='h-[250px] w-[250px]' src={prizes["150 tokens"]} alt="150 coins" />
                                <img className='h-[250px] w-[250px] ml-20' src={prizes["100 tokens"]} alt="100 coins" />
                                <img className='h-[250px] w-[250px] ml-20' src={prizes["80 tokens"]} alt="80 coins" />
                                <img className='h-[250px] w-[250px] ml-20' src={prizes["50 tokens"]} alt="50 coins" />
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default FreeCase