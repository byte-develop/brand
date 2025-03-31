import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/auth.service';
import "./Chart.css"
import { useMediaQuery } from 'react-responsive';
Chart.register(...registerables);

function Crash() {
    // ---------- Состояния ----------
    const [resultTimes, setResultTimes] = useState(1); // Множитель
    const [maxLimitX, setMaxLimitX] = useState(20); // Максимальное значение оси X
    const [maxLimitY, setMaxLimitY] = useState(10); // Максимальное значение оси Y
    const [betAmount, setBetAmount] = useState(0); // Сумма ставки
    const [bet, setBet] = useState(''); // Введенная ставка
    const [gameStarted, setGameStarted] = useState(false); // Игра началась?
    const [currentWin, setCurrentWin] = useState(0); // Текущий выигрыш
    const [gameState, setGameState] = useState(null); // Состояние игры с сервера
    const [gamePhase, setGamePhase] = useState('betting'); // Фаза игры (betting, game)
    const [timeLeft, setTimeLeft] = useState(20); // Оставшееся время (в секундах)
    const [UID, setUID] = useState(null); // Уникальный ID игры
    const [result, setResult] = useState(0); // Конечный результат (множитель)
    const isAuth = useAuth(); // Хук для авторизации
    const user = useSelector((state) => state.user.user); // Информация о пользователе из Redux
    const dispatch = useDispatch(); // Dispatch из Redux
    const [balance, setBalance] = useState(0); // Баланс пользователя
    const animationIntervalRef = useRef(null); // useRef для animationFrame анимации графика
    const multiplierIntervalRef = useRef(null) // useRef для animationFrame анимации множителя
    const [stopcashout, setStopCashout] = useState(true)
    // ---------- График ----------
    const chartOptions = {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                grid: { display: false },
                min: 0,
                max: maxLimitX,
                ticks: { display: false },
            },
            y: {
                type: 'linear',
                position: 'left',
                grid: { display: false },
                min: 1,
                max: maxLimitY,
                ticks: { display: false },
                callback: (value) => (value ? value + 'x' : ''),
                font: { size: 18 },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
            hover: { mode: null }
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            elements: { point: { radius: 0 } }
        }
    };

    const initialChartData = {
        labels: [],
        datasets: [
            {
                label: 'Множитель',
                data: [],
                borderColor: 'rgb(0, 32, 151)',
                borderWidth: 6,
                fill: true,
                backgroundColor: 'rgb(0%, 14%, 48%, .4)',
                pointRadius: 0,
                pointHoverRadius: 0
            },
        ],
    };

    const [chartData, setChartData] = useState(initialChartData);

    // ---------- Эффекты ----------

    // Получение данных пользователя
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await AuthService.getMe();
                dispatch({ type: 'user/LoginSlice', payload: response });
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            }
        };
        fetchUserProfile();
    }, [dispatch]);

    // Получение баланса пользователя
    useEffect(() => {
        const GetBalance = async () => {
            if (user && user.id) {
                try {
                    const response = await fetch('/bonus/get_balance', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ID: user.id }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setBalance(data.balance);
                } catch (error) {
                    console.error('Error fetching balance:', error);
                }
            }
        };

        GetBalance();
    }, [user]);

    // Получение состояния игры с сервера
    useEffect(() => {
        const fetchGameState = async () => {
            try {
                const response = await fetch('/api/crash/game-state');
                if (!response.ok) throw new Error('Не удалось получить состояние игры');

                const data = await response.json();
                console.log(data.gamePhase)
                setGameState(data);
                setGamePhase(data.gamePhase);
                setTimeLeft(data.timeLeft);
                setUID(data.UID);
                setResult(data.result);

            } catch (error) {
                console.error('Ошибка при получении состояния игры:', error);
            }
        };

        fetchGameState();
        const intervalId = setInterval(fetchGameState, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // Запуск/остановка анимации при смене фазы игры
    useEffect(() => {
        if (gamePhase === 'game') {
            startAnimation(); // Запуск анимации графика
            startMultiplierUpdate(); // Запуск обновления множителя
            setGameStarted(true)
            if (bet > 0) {
                setStopCashout(false)
            }
        } else {
            stopAnimation(); // Остановка анимации графика
            stopMultiplierUpdate() // Остановка обновления множителя
            setGameStarted(false)
            setResultTimes(1); // Сброс множителя
            setChartData(initialChartData); // Сброс данных графика
            setCurrentWin(0);
            setBetAmount(0)
            setBet(0)
        }
    }, [gamePhase, result]);



    // ---------- Логика игры ----------

    const placeBet = async () => {
        if (bet <= 0) return;

        if (+balance < +bet) {
            toast.error('Недостаточно средств');
            return;
        }

        try {
            const newBalance = +balance - +bet;
            await fetch('/api/user/balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: +user.id, balance: newBalance }),
            });

            await fetch('/api/transfers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_user: +user.id, price: -bet, date: new Date().toISOString(), key: "Ставка в авиаторе" }),
            });

            setBalance(newBalance);
            setBetAmount(+bet);
            setCurrentWin(+bet * resultTimes); // Обновляем начальный выигрыш
            GetBalance();
        } catch (error) {
            console.error('Ошибка при размещении ставки:', error);
        }
    };

    const startGame = (e) => {
        e.preventDefault();
        if (!bet || isNaN(bet) || parseFloat(bet) <= 0) {
            toast.error('Пожалуйста, введите корректную ставку.');
            return;
        }

        placeBet();
    };


    const cashOut = async () => {
        try {
            const price = +betAmount * +resultTimes;
            const newBalance = price + +balance;

            await fetch('/api/user/balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: +user.id, balance: newBalance.toFixed(0) }),
            });

            await fetch('/api/transfers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_user: +user.id, price: `+${+price.toFixed(0)}`, date: new Date().toISOString(), key: "Выигрыш в авиаторе" }),
            });

            setCurrentWin(0);
            setBet(0)
            setBetAmount(0)
            GetBalance();
            setCurrentWin(0)
        } catch (error) {
            console.error('Ошибка при выводе средств:', error);
            toast.error('Не удалось забрать выигрыш.');
        }
    };

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


    // ---------- Анимация графика ----------
    const startAnimation = () => {
        stopAnimation();

        let animationStartTime = null;
        const duration = 3000; // Фиксированная длительность анимации графика (3 секунды)
        const targetX = 15; // Фиксированная координата X, к которой будет стремиться график
        const targetY = 6; // Фиксированная координата Y, к которой будет стремиться график


        const animate = (currentTime) => {
            if (!animationStartTime) {
                animationStartTime = currentTime;
            }

            const elapsedTime = currentTime - animationStartTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const newX = progress * targetX;
            const newY = 1 + progress * (targetY - 1);


            setMaxLimitX(20);
            setMaxLimitY(10);
            setChartData((prevData) => ({
                ...prevData,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: [{ x: newX, y: newY }, ...prevData.datasets[0].data],
                    },
                ],
            }));

            if (progress < 1 && gamePhase === 'game') {
                animationIntervalRef.current = requestAnimationFrame(animate);
            } else {
                stopAnimation();
            }
        };

        animationIntervalRef.current = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
        if (animationIntervalRef.current) {
            cancelAnimationFrame(animationIntervalRef.current);
            animationIntervalRef.current = null;
        }
    };

    // ---------- Обновление множителя ----------
    const startMultiplierUpdate = () => {
        stopMultiplierUpdate()

        const multiplierIncreaseRate = (result - 1) / (timeLeft * 1000); // Скорость увеличения множителя
        let multiplierStartTime = null;
        let initialMultiplier = resultTimes;

        const updateMultiplier = (timestamp) => {
            if (!multiplierStartTime) {
                multiplierStartTime = timestamp;
                initialMultiplier = resultTimes
            }

            const multiplierElapsedTime = timestamp - multiplierStartTime;
            const multiplierProgress = Math.min(multiplierElapsedTime / (timeLeft * 1000), 1);
            const newMultiplier = initialMultiplier + multiplierProgress * (result - 1);

            setResultTimes(newMultiplier);
            setCurrentWin(+betAmount * newMultiplier); // Обновляем потенциальный выигрыш

            if (multiplierProgress < 1 && gamePhase === 'game') {
                multiplierIntervalRef.current = requestAnimationFrame(updateMultiplier);
            } else {
                stopMultiplierUpdate();
            }
        }

        multiplierIntervalRef.current = requestAnimationFrame(updateMultiplier);
    }

    const stopMultiplierUpdate = () => {
        if (multiplierIntervalRef.current) {
            cancelAnimationFrame(multiplierIntervalRef.current);
            multiplierIntervalRef.current = null
        }
    }

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <>
            {
                isMobile ?

                    <div className="relative flex flex-col">
                        <div className="flex flex-col justify-between items-center mb-24 relative z-10">
                            <p className='font-[OB] text-[32px] text-transparent mb-3' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>CRASH</p>
                            <div className="flex flex-col items-center gap-5">
                                <div className="">
                                    <div className="chart-table2 flex justify-center items-center overflow-hidden" style={{ position: 'relative' }}>
                                        <div className=" absolute top-[20px]">
                                            <span className='font-[OSB]' style={{ fontSize: '36px' }}>{gamePhase == "betting" ? <>{timeLeft} сек</> : <>{resultTimes.toFixed(2)}x</>}</span>
                                        </div>
                                        <div className="translate-y-[9px] h-full w-[720px] rounded-[20px] flex justify-end items-end overflow-hidden">
                                            <Line data={chartData} options={chartOptions} />
                                        </div>
                                    </div>

                                </div>
                                <form onSubmit={startGame} className='w-[360px] h-[60px] flex items-center justify-center rounded-[20px] bg-[#D9D9D9] bg-opacity-5 gap-3'>
                                    <input
                                        type="text"
                                        name="bet"
                                        id="bet"
                                        className='w-[192px] h-[38px] rounded-[10px] bg-black pl-4 text-[15px] text-[#646464]'
                                        placeholder='Введите число'
                                        value={bet}
                                        onChange={(e) => setBet(e.target.value)}
                                        disabled={gamePhase === 'game'}
                                    />
                                    <button
                                        type='submit'
                                        className='w-[118px] h-[39px] rounded-[10px] font-[OSB] text-[14px]'
                                        style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                                        disabled={gamePhase === 'game' || betAmount > 0}
                                    >
                                        ИГРАТЬ
                                    </button>
                                </form>
                                <div className="w-[360px] h-[170px] bg-[url(../public/block.png)] bg-no-repeat bg-cover bg-center rounded-[20px] flex  justify-between p-5">
                                    <div className="">
                                        <p className='text-[20px] text-white font-[OSB]'>Баланс: {balance}</p>
                                        <p className='text-[16px] font-[OSB] text-[#888888]'>Ставка: {betAmount ? betAmount : 0}</p>
                                        <p className='text-[20px] text-white font-[OB] mt-5'>Выигрыш: {currentWin.toFixed(0)}</p>
                                    </div>

                                    <button
                                        onClick={cashOut}
                                        className='w-[123px] h-[37px] text-[15px] font-[OSB] text-white rounded-[10px]'
                                        style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                                        disabled={stopcashout}
                                    >
                                        Забрать
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    :

                    <div className="relative">
                        <div className="flex justify-between items-end px-[14%] mt-10 mb-24 relative z-10">
                            <div className="flex flex-col items-center gap-5">
                                <p className='font-[OEB] text-[48px] text-transparent mb-3' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>CRASH</p>

                                <p className='text-[36px] font-[OSB]'>ВАША СТАВКА</p>

                                <form onSubmit={startGame} className='w-[516px] h-[100px] flex items-center justify-center rounded-[20px] bg-[#D9D9D9] bg-opacity-5 gap-3'>
                                    <input
                                        type="text"
                                        name="bet"
                                        id="bet"
                                        className='w-[300px] h-[64px] rounded-2xl bg-black pl-4 text-[32px] text-[#646464]'
                                        placeholder='Введите число'
                                        value={bet}
                                        onChange={(e) => setBet(e.target.value)}
                                        disabled={gamePhase === 'game'}
                                    />
                                    <button
                                        type='submit'
                                        className='w-[177px] h-[64px] rounded-2xl font-[OSB] text-[30px]'
                                        style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                                        disabled={gamePhase === 'game' || betAmount > 0}
                                    >
                                        ИГРАТЬ
                                    </button>
                                </form>
                                <div className="w-[516px] h-[100px] flex items-center justify-center rounded-[20px] bg-[#D9D9D9] bg-opacity-5">
                                    <p className='text-[32px] text-white font-[OSB]'>Баланс: {balance}</p>
                                </div>
                                <div className="w-[516px] h-[100px] flex items-center justify-center rounded-[20px] bg-[#D9D9D9] bg-opacity-5">
                                    <p className='text-[32px] text-white font-[OSB]'>Ставка: {betAmount ? betAmount : 0}</p>
                                </div>
                                <div className="w-[516px] h-[100px] flex items-center justify-center rounded-[20px] bg-[#D9D9D9] bg-opacity-5">
                                    <p className='text-[32px] text-white font-[OSB]'>Выигрыш: {currentWin.toFixed(0)}</p>
                                </div>
                                <button
                                    onClick={cashOut}
                                    className='w-[516px] h-[84px] text-[32px] font-[OSB] text-white rounded-2xl'
                                    style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                                    disabled={stopcashout}
                                >
                                    Забрать выигрыш
                                </button>
                            </div>
                            <div className="">
                                <div className="chart-table flex justify-center items-center overflow-hidden" style={{ position: 'relative' }}>
                                    <div className=" absolute top-[50px]">
                                        <span className='font-[OSB]' style={{ fontSize: '72px' }}>{gamePhase == "betting" ? <>{timeLeft} сек</> : <>{resultTimes.toFixed(2)}x</>}</span>
                                    </div>
                                    <div className="translate-y-[9px] h-full w-[720px] rounded-[40px] flex justify-end items-end overflow-hidden">
                                        <Line data={chartData} options={chartOptions} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
            }
        </>
    );
}

export default Crash;