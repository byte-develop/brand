import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AuthService } from '../services/auth.service';
import { toast } from 'react-toastify';
import { IoClose } from "react-icons/io5";
import { useMediaQuery } from 'react-responsive';

const Roulette = () => {
    const colors = [
        {
            color: "blue",
            probability: 1 / 130,
            rotate: 0,
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -9
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -19
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -28
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -38
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -47
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -57
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -67
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -76
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -87
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -96
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -106
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -116
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -126
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -136
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -145
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -155
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -165
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -175
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -184
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -190
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -204
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -214
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -224
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -233
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -243
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -253
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -263
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -272
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -282
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -292
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -301
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -311
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -321
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -331
        },
        {
            color: "red",
            probability: 1 / 50,
            rotate: -340
        },
        {
            color: "black",
            probability: 1 / 50,
            rotate: -350
        },
    ]

    const [result, setResult] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [gamePhase, setGamePhase] = useState('betting');
    const [gameState, setGameState] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [betAmount, setBetAmount] = useState('');
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [UID, setUID] = useState(null);
    const [bets, setBets] = useState([]);
    const [balance, setBalance] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [balanceUpdate, setBalanceUpdate] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Получение профиля пользователя
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await AuthService.getMe();
                dispatch({ type: 'user/LoginSlice', payload: response });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchUserProfile();
    }, [dispatch]);

    // Получение баланса
    const GetBalance = async () => {
        if (user && user.id) {
            try {
                const response = await fetch('/bonus/get_balance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ID: user.id }),
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                setBalance(data.balance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        }
    };

    useEffect(() => {
        GetBalance();
    }, [user]);

    // Размещение ставки
    const placeBet = async () => {
        if (!selectedColor || betAmount <= 0 || gamePhase !== 'betting') return;

        if (balance < betAmount) {
            toast.error('Недостаточно средств');
            return;
        }

        try {
            // Обновление баланса
            const newBalance = balance - betAmount;
            await fetch('/api/user/balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: +user.id, balance: newBalance }),
            });

            await fetch('/api/transfers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_user: +user.id, price: -betAmount, date: new Date().toISOString(), key: "Ставка в рулетке" }),
            });

            await fetch('/api/bets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: +user.id,
                    betAmount,
                    betColor: selectedColor,
                    betTime: new Date(),
                    UID,
                }),
            });



            setSelectedColor(null);
            setBetAmount(0);
            GetBalance();
        } catch (error) {
            console.error('Error placing bet:', error);
        }
    };

    // Получение ставок
    useEffect(() => {
        const fetchBets = async () => {
            try {
                const response = await fetch(`/api/bets/UID/${UID}`);
                if (!response.ok) throw new Error('Failed to fetch bets');

                const data = await response.json();
                setBets(data);
            } catch (error) {
                console.error('Error fetching bets:', error);
            }
        };

        fetchBets();

        const intervalId = setInterval(fetchBets, 1000);

        return () => clearInterval(intervalId);
    }, [UID]);

    // Обновление баланса и логирование выигрышей
    useEffect(() => {
        const updateBalanceAndLogWin = async () => {
            if (gameState && gameState.gamePhase === 'pause' && !balanceUpdate) {
                try {
                    const response = await fetch(`/api/bets/UID/${UID}`);
                    if (!response.ok) throw new Error('Failed to fetch bets for win calculation');

                    const betsData = await response.json();
                    if (betsData.length > 0) {
                        let updatedBalance = balance;

                        // Фильтруем ставки текущего пользователя
                        const userBets = betsData.filter(bet => bet.userId === user.id);

                        for (const bet of userBets) {
                            if (bet.betColor === gameState.result) {
                                let winnings;
                                if (gameState.result === 'red' || gameState.result === 'black') {
                                    winnings = bet.betAmount * 2;
                                } else if (gameState.result === 'blue') {
                                    winnings = bet.betAmount * 5;
                                }

                                updatedBalance += winnings;

                                // Логируем выигрыш
                                await fetch('/api/transfers', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ id_user: +user.id, price: +winnings, date: new Date().toISOString(), key: "Выигрыш в рулетке" }),
                                });
                            }
                        }

                        // Обновляем баланс
                        await fetch('/api/user/balance', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: +user.id, balance: +updatedBalance }),
                        });

                        setBalance(updatedBalance);
                        setBalanceUpdate(true);
                    }
                } catch (error) {
                    console.error('Error updating balance and logging wins:', error);
                }
            }
        };

        updateBalanceAndLogWin();
    }, [gameState]);

    // Получение состояния игры
    useEffect(() => {
        const fetchGameState = async () => {
            try {
                const response = await fetch('/api/roulette/game-state', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                if (!data) return;
                setGameState(data);
                setGamePhase(data.gamePhase);
                setTimeLeft(data.timeLeft);
                setUID(data.UID);

                if (data.gamePhase === 'betting') {
                    setBalanceUpdate(false);
                }

                if (data.gamePhase === 'spinning' && !isSpinning) {
                    setIsSpinning(true);

                    const totalRotations = 15 * 360;
                    const wheel = document.querySelector('.roulette-wheel');
                    if (wheel) {
                        wheel.style.transition = 'transform 15s cubic-bezier(0.32, 0, 0.23, 1)';
                        setRotation(totalRotations + data.rotate);
                    }

                    // Обработка результата через таймеры
                    setTimeout(() => handleSpinResult(data), 15000);
                }

            } catch (error) {
                console.error('Error fetching game state:', error);
            }
        };

        fetchGameState();
        const intervalId = setInterval(fetchGameState, 1000);

        return () => clearInterval(intervalId);
    }, [isSpinning]);

    // Обработка результата спина
    const handleSpinResult = (data) => {
        if (data.result) {
            const resultColor = colors.find(c => c.color === data.result);
            setResult(resultColor);
        }

        // Сброс состояния после спина
        setTimeout(() => resetSpin(), 5000);
    };

    // Сброс состояния спина
    const resetSpin = () => {
        setIsSpinning(false);
        setResult(null);

        // Сброс вращения колеса
        const wheel = document.querySelector('.roulette-wheel');
        if (wheel) {
            wheel.style.transition = 'none';
            setRotation(0);
        }
    };

    // Фильтрация ставок
    const [filter, setFilter] = useState('red');
    const filteredBets = filter ? bets.filter(bet => bet.betColor === filter) : bets;
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <>
            {isMobile ?

                <div className='flex flex-col items-center gap-4 justify-end'>
                    <p className='font-[OB] text-[32px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ROULETTE</p>
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-[#080808] rounded-lg p-5 w-[90%] h-[60%] overflow-y-scroll">
                                <div className="w-full h-full relative">

                                    <button className="absolute top-0 right-0 text-[24px] font-[OSB] text-[#150098]" onClick={handleCloseModal}><IoClose size={30} /></button>
                                    <h2 className="font-[OB] text-[24px] mb-4">Все ставки</h2>
                                    <div className="flex flex-col gap-2">
                                        {bets.map(bet => (
                                            <div key={bet.id} className={`w-[300px] h-[60px] ${bet.betColor === "blue" ? "bg-[#0600B7]" : bet.betColor === "red" ? "bg-[#B40000]" : "bg-[#000000]"} flex items-center rounded-2xl mb-2`}>
                                                <div className="ml-7 mr-7 w-full flex items-start justify-between">
                                                    <div>
                                                        <p className='text-[15px] font-[OB]'>КОЭФФИЦИЕНТ: {bet.betColor === "blue" ? 5 : 2}X</p>
                                                        <p className='text-[14px] font-[OSB]'>статус: принята</p>
                                                    </div>
                                                    <div className="">
                                                        <p className='text-[15px] font-[OB]'>{bet.betAmount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                    <div className='relative w-[250px] h-[250px] m-1'>
                        <img
                            src="../public/roulette_arrow.png"
                            className='w-[30px] h-[30px] absolute left-[50%] translate-x-[-50%] top-[-1%] z-10'
                            alt=""
                        />
                        <div className="flex items-center justify-center relative">
                            {gamePhase === "betting" ? <p className='z-10 absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] font-[OB] text-[30px]'>{timeLeft}</p> : <img src="../public/B.png" className='z-10 absolute left-[50%] translate-x-[-48%] top-[50%] translate-y-[-50%] h-[50px]' alt="" />}
                            <img
                                src="../public/roulette.png"
                                className='roulette-wheel w-[250px] h-[250px] object-contain rounded-full'
                                style={{ transform: `rotate(${rotation}deg)` }}
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="flex w-full flex-col justify-between items-center mb-28 relative z-10">

                        <div className='flex flex-col gap-4 items-center text-black'>
                            <div className="w-[350px] h-[70px] flex items-center justify-center rounded-[20px] bg-[#D9D9D9] bg-opacity-5">
                                <p className='text-[24px] text-white font-[OSB]'>Баланс: {balance}</p>
                            </div>
                            <div className="flex flex-col w-[356px] h-[513px] justify-start rounded-2xl bg-[#080808] items-center">
                                <div className="">
                                    <p className='text-[18px] text-white font-[OB] mt-4'>СТАВКА ПО ЦВЕТУ</p>
                                    <div className='flex mt-2'>
                                        <button
                                            className={`h-[50px] w-[105px] text-[18px] font-[OSB] rounded-l-[10px] ${selectedColor === 'red' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setSelectedColor('red')}
                                        >
                                            Красное
                                        </button>
                                        <button
                                            className={`h-[50px] w-[105px] text-[18px] font-[OSB] ${selectedColor === 'black' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setSelectedColor('black')}
                                        >
                                            Черное
                                        </button>
                                        <button
                                            className={`h-[50px] w-[105px] text-[18px] font-[OSB] rounded-r-[10px] ${selectedColor === 'blue' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setSelectedColor('blue')}
                                        >
                                            Синее
                                        </button>
                                    </div>
                                    <div className="flex gap-2 items-center mt-2">
                                        <input
                                            type="text"
                                            value={betAmount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^(0|[1-9]\d*)?$/.test(value) && !(value === '0' && betAmount !== '')) {
                                                    setBetAmount(value === '' ? '' : Number(value));
                                                }
                                            }}
                                            className='w-[165px] h-[50px] rounded-[10px] pl-4 text-[18px] font-[OR] bg-[#161616] text-[#646464]'
                                            placeholder='Ваша ставка'
                                            style={{ appearance: 'none', MozAppearance: 'textfield' }}
                                        />


                                        <button
                                            onClick={placeBet}
                                            disabled={gamePhase !== 'betting' || !selectedColor || betAmount <= 0}
                                            className='w-[140px] h-[50px] text-[15px] font-[OSB] text-white rounded-2xl'
                                            style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                                        >
                                            Добавить
                                        </button>
                                    </div>
                                </div>
                                <div className='mt-2 flex flex-col gap-2 items-center text-white'>
                                    <div className="flex justify-between w-[356px]">
                                        <div className="flex justify-between w-[356px] px-[6%]">
                                            <p className='font-[OB] text-[18px]'>История ставок</p>
                                            <p className='font-[OSB] text-[18px] text-[#150098]' onClick={handleOpenModal}>смотреть все</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <button
                                            className={`h-[50px] w-[105px] text-[18px] font-[OSB] rounded-l-2xl ${filter === 'red' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setFilter('red')}
                                        >
                                            Красное
                                        </button>
                                        <button
                                            className={`h-[50px] w-[105px] text-[18px] font-[OSB] ${filter === 'black' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setFilter('black')}
                                        >
                                            Черное
                                        </button>
                                        <button
                                            className={`h-[50px] w-[105px] text-[18px] font-[OSB] rounded-r-2xl ${filter === 'blue' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setFilter('blue')}
                                        >
                                            Синее
                                        </button>
                                    </div>
                                    <div className='flex gap-2 flex-col'>
                                        {filteredBets.slice(-3).map(bet => (
                                            <div key={bet.id} className='w-[300px] h-[60px] bg-[#161616] flex items-center rounded-2xl'>
                                                <div className="ml-7 mr-7 w-full flex items-start justify-between">
                                                    <div className="">
                                                        <p className='text-[15px] font-[OB]'>КОЭФФИЦИЕНТ: {bet.betColor === "blue" ? 5 : 2}X</p>
                                                        <p className='text-[14px] font-[OSB] text-[#2400FF]'>статус: принята</p>
                                                    </div>
                                                    <p className='text-[15px] font-[OB]'>{bet.betAmount}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                :

                <div className='flex flex-col items-center gap-4 justify-end mt-24'>
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-[#080808] rounded-lg p-5 w-[70%] h-[60%] overflow-y-scroll">
                                <div className="w-full h-full relative">

                                    <button className="absolute top-0 right-0 text-[24px] font-[OSB] text-[#150098]" onClick={handleCloseModal}><IoClose size={30} /></button>
                                    <h2 className="font-[OB] text-[24px] mb-4">Все ставки</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {bets.map(bet => (
                                            <div key={bet.id} className={`w-[415px] h-[100px] ${bet.betColor === "blue" ? "bg-[#0600B7]" : bet.betColor === "red" ? "bg-[#B40000]" : "bg-[#000000]"} flex items-center rounded-2xl mb-2`}>
                                                <div className="ml-7 mr-7 w-full flex items-start justify-between">
                                                    <div>
                                                        <p className='text-[20px] font-[OB]'>КОЭФФИЦИЕНТ: {bet.betColor === "blue" ? 5 : 2}X</p>
                                                        <p className='text-[20px] font-[OSB]'>статус: принята</p>
                                                    </div>
                                                    <div className="">
                                                        <p className='text-[20px] font-[OB]'>{bet.betAmount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex w-full px-[14%] justify-between mb-28 relative z-10">

                        <div className='mt-4 flex flex-col gap-4 items-center text-black'>
                            <p className='font-[OEB] text-[48px] text-transparent mb-3' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ROULETTE</p>
                            <div className="w-[474px] h-[100px] flex items-center justify-center rounded-[20px] bg-[#D9D9D9] bg-opacity-5">
                                <p className='text-[32px] text-white font-[OSB]'>Баланс: {balance}</p>
                            </div>
                            <div className="flex flex-col w-[474px] h-[606px] justify-start rounded-2xl bg-[#080808] items-center">
                                <div className="">
                                    <p className='text-[24px] text-white font-[OB]'>СТАВКА ПО ЦВЕТУ</p>
                                    <div className='flex mt-2'>
                                        <button
                                            className={`h-[67px] w-[138px] text-[24px] font-[OSB] rounded-l-2xl ${selectedColor === 'red' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setSelectedColor('red')}
                                        >
                                            Красное
                                        </button>
                                        <button
                                            className={`h-[67px] w-[138px] text-[24px] font-[OSB] ${selectedColor === 'black' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setSelectedColor('black')}
                                        >
                                            Черное
                                        </button>
                                        <button
                                            className={`h-[67px] w-[138px] text-[24px] font-[OSB] rounded-r-2xl ${selectedColor === 'blue' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setSelectedColor('blue')}
                                        >
                                            Синее
                                        </button>
                                    </div>
                                    <div className="flex gap-2 items-center mt-2">
                                        <input
                                            type="text"
                                            value={betAmount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^(0|[1-9]\d*)?$/.test(value) && !(value === '0' && betAmount !== '')) {
                                                    setBetAmount(value === '' ? '' : Number(value));
                                                }
                                            }}
                                            className='w-[220px] h-[67px] rounded-2xl pl-4 text-[24px] font-[OR] bg-[#161616] text-[#646464]'
                                            placeholder='Сумма ставки'
                                            style={{ appearance: 'none', MozAppearance: 'textfield' }}
                                        />


                                        <button
                                            onClick={placeBet}
                                            disabled={gamePhase !== 'betting' || !selectedColor || betAmount <= 0}
                                            className='w-[186px] h-[67px] text-[20px] font-[OSB] text-white rounded-2xl'
                                            style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                                        >
                                            Добавить
                                        </button>
                                    </div>
                                </div>
                                <div className='mt-2 flex flex-col gap-2 items-center text-white'>
                                    <div className="flex justify-between w-[415px]">
                                        <div className="flex justify-between w-[415px]">
                                            <p className='font-[OB] text-[24px]'>История ставок</p>
                                            <p className='font-[OSB] text-[24px] text-[#150098]' onClick={handleOpenModal}>смотреть все</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <button
                                            className={`h-[67px] w-[138px] text-[24px] font-[OSB] rounded-l-2xl ${filter === 'red' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setFilter('red')}
                                        >
                                            Красное
                                        </button>
                                        <button
                                            className={`h-[67px] w-[138px] text-[24px] font-[OSB] ${filter === 'black' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setFilter('black')}
                                        >
                                            Черное
                                        </button>
                                        <button
                                            className={`h-[67px] w-[138px] text-[24px] font-[OSB] rounded-r-2xl ${filter === 'blue' ? 'bg-[#2C2C2C] border-b-[5px] border-[#150098]' : 'bg-[#161616]'} text-white`}
                                            onClick={() => setFilter('blue')}
                                        >
                                            Синее
                                        </button>
                                    </div>
                                    <div className='flex gap-2 flex-col'>
                                        {filteredBets.slice(-3).map(bet => (
                                            <div key={bet.id} className='w-[415px] h-[84px] bg-[#161616] flex items-center rounded-2xl'>
                                                <div className="ml-7 mr-7 w-full flex items-start justify-between">
                                                    <div className="">
                                                        <p className='text-[20px] font-[OB]'>КОЭФФИЦИЕНТ: {bet.betColor === "blue" ? 5 : 2}X</p>
                                                        <p className='text-[20px] font-[OSB] text-[#2400FF]'>статус: принята</p>
                                                    </div>
                                                    <p className='text-[20px] font-[OB]'>{bet.betAmount}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='relative w-[741px] h-[741px]'>
                            <img
                                src="../public/roulette_arrow.png"
                                className='w-[100px] h-[100px] absolute left-[50%] translate-x-[-50%] top-[-2%] z-10'
                                alt=""
                            />
                            <div className="flex items-center justify-center relative">
                                {gamePhase === "betting" ? <p className='z-10 absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] font-[OB] text-[50px]'>{timeLeft}</p> : <img src="../public/B.png" className='z-10 absolute left-[50%] translate-x-[-48%] top-[50%] translate-y-[-50%] w-[130px]' alt="" />}
                                <img
                                    src="../public/roulette.png"
                                    className='roulette-wheel w-[741px] h-[741px] object-contain rounded-full'
                                    style={{ transform: `rotate(${rotation}deg)` }}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>

            }
        </>

    )
}

export default Roulette