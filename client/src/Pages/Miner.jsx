import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

const Miner = () => {
    const [bet, setBet] = useState('');
    const [betAmount, setBetAmount] = useState('');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [cells, setCells] = useState([[], [], [], [], []]);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [currentWin, setCurrentWin] = useState(0);
    const [balance, setBalance] = useState(0);
    const isAuth = useAuth();
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


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

    const minesConfig = {
        1: { mineCount: 1, multiplier: 1.2 },
        2: { mineCount: 1, multiplier: 1.4 },
        3: { mineCount: [1, 2], multiplier: 1.6 },
        4: { mineCount: 2, multiplier: 1.7 },
        5: { mineCount: 2, multiplier: 2.0 },
    };

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
                body: JSON.stringify({ id_user: +user.id, price: -bet, date: new Date().toISOString(), key: "Ставка в минере" }),
            });

            setBetAmount(bet)
            GetBalance()
            setBet(0)
            setGameStarted(true);
            setGameOver(false);
            setWon(false);
            setCurrentLevel(1);
            setMultiplier(1);
            setCurrentWin(parseFloat(bet));
            setCells(Array(5).fill(null).map(() => Array(3).fill(null)));
            setResultMessage('');

        } catch (error) {
            console.error('Error placing bet:', error);
        }
    };

    const startGame = (e) => {
        e.preventDefault();
        if (!bet || isNaN(bet) || parseFloat(bet) <= 0) {
            toast.error('Пожалуйста, введите корректную ставку.');
            return;
        }

        placeBet()
    };

    const handleClick = async (level, cellIndex) => {
        if (gameOver || won) return;

        let minesCount = minesConfig[level].mineCount;

        if (Array.isArray(minesCount)) {
            minesCount = minesCount[Math.round(Math.random())];
        }

        let minePositions = [];
        while (minePositions.length < minesCount) {
            const randomPosition = Math.floor(Math.random() * 3);
            if (!minePositions.includes(randomPosition)) {
                minePositions.push(randomPosition);
            }
        }

        const isMine = minePositions.includes(cellIndex);
        const newCells = [...cells];
        newCells[level - 1] = newCells[level - 1].map((_, i) =>
            i === cellIndex ? (isMine ? 'red' : 'green') : null
        );
        setCells(newCells);

        if (isMine) {
            setGameOver(true);
            setGameStarted(false); // Игра окончена, можно ставить снова
            setResultMessage('Вы проиграли!');
            setBetAmount(0)
            setCurrentWin(0)
        } else {
            const newMultiplier = minesConfig[level].multiplier;
            setCurrentWin(betAmount * newMultiplier);
            if (level === 5) {
                setWon(true);
                setGameStarted(false);

                const newBalance = +balance + +currentWin.toFixed(0);

                await fetch('/api/user/balance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: +user.id, balance: newBalance }),
                });

                await fetch('/api/transfers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_user: +user.id, price: bet, date: new Date().toISOString(), key: "Выигрыш в минере" }),
                });
                setBetAmount(0)
                GetBalance()
                setCurrentWin(0)
            } else {
                setCurrentLevel(level + 1);
                setMultiplier(newMultiplier);
            }
        }
    };

    const cashOut = async () => {

        const newBalance = +balance + +currentWin.toFixed(0);

        await fetch('/api/user/balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: +user.id, balance: newBalance }),
        });

        await fetch('/api/transfers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_user: +user.id, price: +currentWin.toFixed(0), date: new Date().toISOString(), key: "Выигрыш в минере" }),
        });

        setGameOver(true);
        setWon(true);
        setGameStarted(false);
        setCurrentWin(0)
        setBetAmount(0)
        GetBalance()
    };

    const renderCells = (level) => {
        return (
            <div className={`level_${level} flex ${isMobile ? "gap-5" : "gap-10"} items-center`}>
                {Array.from({ length: 3 }, (_, i) => (
                    <div
                        key={i}
                        className={isMobile ? "w-[70px] h-[70px] rounded-[10px] flex items-center justify-center cursor-pointer" : "w-[140px] h-[140px] rounded-[20px] flex items-center justify-center cursor-pointer"}
                        style={{
                            background: cells[level - 1][i] === 'red' ? 'linear-gradient(189deg, rgba(196,25,25,1) 0%, rgba(94,12,12,1) 100%)' : cells[level - 1][i] === 'green' ? 'linear-gradient(138deg, rgba(212,227,255,1) 0%, rgba(97,116,154,1) 89%)' : "linear-gradient(148deg, rgba(37,45,64,1) 6%, rgba(0,10,33,1) 88%)",
                            pointerEvents: (gameStarted && level === currentLevel && !gameOver && !won) ? 'auto' : 'none',
                            opacity: (gameStarted && level === currentLevel && !gameOver && !won) ? 1 : 0.5,
                        }}
                        onClick={() => handleClick(level, i)}
                    >
                        {cells[level - 1][i] === "green" ? <img className='w-[22px]' src="../public/gla.png" alt="?" /> : cells[level - 1][i] === 'red' ? <img className='w-[40px]' src="../public/bomb.png" alt="?" /> : <img src="../public/ask.png" alt="?" />}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            {isMobile ?

                <div className="flex flex-col items-center mb-24 relative">
                    <p className='font-[OB] text-[32px] text-transparent mb-3' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>MINES</p>
                    <div className="flex flex-col items-center">
                        <div className="game flex flex-col items-center gap-3">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <div key={level}>
                                    {renderCells(level)}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-5 relative z-10 mt-8">
                        <form onSubmit={startGame} className='w-[360px] h-[60px] flex items-center justify-center rounded-[20px] bg-[#D9D9D9] bg-opacity-5 gap-3'>
                            <input
                                type="text"
                                name="bet"
                                id="bet"
                                className='w-[192px] h-[38px] rounded-[10px] bg-black pl-4 text-[15px] text-[#646464]'
                                placeholder='Введите число'
                                value={bet}
                                onChange={(e) => setBet(e.target.value)}
                                disabled={gameStarted}
                            />
                            <button
                                type='submit'
                                className='w-[118px] h-[39px] rounded-[10px] font-[OSB] text-[14px]'
                                style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                                disabled={gameStarted}
                            >
                                ИГРАТЬ
                            </button>
                        </form>
                    </div>
                    <div className="w-[360px] h-[170px] bg-[url(../public/block.png)] bg-no-repeat bg-cover bg-center rounded-[20px] flex  justify-between p-5 mt-3">
                        <div className="">
                            <p className='text-[20px] text-white font-[OSB]'>Баланс: {balance}</p>
                            <p className='text-[16px] font-[OSB] text-[#888888]'>Ставка: {betAmount ? betAmount : 0}</p>
                            <p className='text-[20px] text-white font-[OB] mt-5'>Выигрыш: {currentWin.toFixed(0)}</p>
                        </div>

                        <button
                            onClick={cashOut}
                            disabled={!gameStarted}
                            className='w-[123px] h-[37px] text-[15px] font-[OSB] text-white rounded-2xl'
                            style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                        >
                            Забрать
                        </button>
                    </div>
                </div>

                :

                <div className="flex justify-between px-[14%] items-end pt-14 mb-24 relative">
                    <img src="../public/miner.png" className='absolute top-0 left-[13%]' alt="" />
                    <div className="flex flex-col items-center gap-5 relative z-10">
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
                                disabled={gameStarted}
                            />
                            <button type='submit' className='w-[177px] h-[64px] rounded-2xl font-[OSB] text-[30px]' style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }} disabled={gameStarted}>ИГРАТЬ</button>
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
                            disabled={!gameStarted}
                            className='w-[516px] h-[84px] text-[32px] font-[OSB] text-white rounded-2xl'
                            style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                        >
                            Забрать выигрыш
                        </button>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className='font-[OEB] text-[90px] text-transparent mb-24' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>MINES</p>
                        <div className="game flex flex-col items-center gap-10">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <div key={level}>
                                    {renderCells(level)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            }
        </>
    );
};

export default Miner;
