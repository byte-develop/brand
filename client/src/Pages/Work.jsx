import WorkItem from "./WorkItem"
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import MobileWorkItem from "./MobileWorkItem";

const Work = () => {
    const [works, setWorks] = useState([]);
    const [category, setCategory] = useState('');
    const [city, setCity] = useState('');
    const [position, setPosition] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const workItemsRef = useRef(null);

    const fetchWorks = async () => {
        const response = await axios.get('/api/works', {
            params: {
                category,
                city,
                searchTerm,
                position,
            }
        });
        setWorks(response.data);
        console.log(works)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWorks();

        if (workItemsRef.current) {
            workItemsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const fetchWorksStart = async () => {

        setCategory('')
        setCity('')
        setSearchTerm('')
        setPosition('')

        try {
            const response = await fetch('/api/works');
            const data = await response.json();
            setWorks(data);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchWorksStart();
    }, []);

    return (
        <>
            {isMobile ?

                <div className="pt-16 relative mb-36 w-[100vw] overflow-x-hidden">
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute left-[-5vw] top-[13vh]" style={{ boxShadow: "0px 0px 40px 70px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute right-[0vw] top-[15vh]" style={{ boxShadow: "0px 0px 40px 70px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute right-[-3vw] top-[45vh]" style={{ boxShadow: "0px 0px 50px 60px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute left-[-7vw] top-[40vh]" style={{ boxShadow: "0px 0px 50px 60px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="flex flex-col items-center">
                        <p className='font-[OB] text-[30px] text-transparent z-10' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>BRAND HUNTER</p>
                        <p className="text-[14px] mt-2 z-10">Нужна помощь в трудоустройстве?</p>
                        <p className="text-[14px] w-[60vw] text-center mt-4 z-10" style={{ whiteSpace: "normal" }}>Воспользуйся <span style={{ position: 'relative', display: 'inline-block' }}>
                            быстрым
                            <span style={{
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                                height: '2px',
                                width: '100%',
                                background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)',
                                zIndex: -1,
                            }} />
                        </span> поиском или спустись ниже, чтобы открыть расширенный поиск.</p>
                        <form onSubmit={handleSubmit} className="px-[8vw] flex flex-wrap justify-center items-center mt-10 z-10">
                            <div className="relative">
                                <img src="../public/lupa.svg" alt="" className="absolute top-[25%] left-[18px] h-[17px]" />
                                <input
                                    type="text"
                                    id="searchTerm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-[70vw] h-[4vh] rounded-full text-center text-[12px] bg-transparent border-[1.5px] text-white"
                                    placeholder="Введите название должности"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-[30vw] h-[4vh] text-white rounded-full font-[OSB] text-[14px] mt-4"
                                style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                            >
                                найти
                            </button>
                        </form>
                    </div>
                    <img src="../public/WorkBGM.svg" alt="" className="w-[100vw] mt-5 z-10 " />
                    <div className="">
                        <form onSubmit={handleSubmit} className="pl-[8vw] pr-[4vw] flex flex-col flex-wrap items-center justify-center">
                            <div className="flex justify-end w-[60vw]">
                                <button
                                    type='button'
                                    onClick={() => fetchWorksStart()}
                                    className="w-[40vw] h-[40px] text-[#0035EF] font-[OSB] text-[12px] mt-8"
                                >
                                    сбросить фильтры
                                </button>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="city" className="block font-[OB] text-[14px]">Город</label>
                                <div className="relative">
                                    <select
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="mt-1 block w-[50vw] h-[30px] text-black rounded-xl pl-3 pr-[40px] appearance-none text-[14px] z-10"
                                    >
                                        <option value="">Выберите город</option>
                                        <option value="ast">Астана</option>
                                        <option value="alm">Алматы</option>
                                        <option value="kar">Караганда</option>
                                    </select>
                                    <span className="absolute right-[12px] top-[50%] transform -translate-y-1/2 pointer-events-none">
                                        <img src="../public/arrow.svg" alt="Стрелка" />
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="position" className="block font-[OB] text-[14px]">Должность</label>
                                <div className="relative">
                                    <select
                                        id="position"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        className="mt-1 block w-[50vw] h-[30px] text-black rounded-xl pl-3 pr-[40px] appearance-none text-[14px] z-10"
                                    >
                                        <option value="">Выберите должность</option>
                                        <option value="oper">Оператор</option>
                                        <option value="zakl">Закладчик</option>
                                        <option value="traf">Трафаретчик</option>
                                        <option value="adm">Администратор</option>
                                    </select>
                                    <span className="absolute right-[12px] top-[50%] transform -translate-y-1/2 pointer-events-none z-10">
                                        <img src="../public/arrow.svg" alt="Стрелка" />
                                    </span>
                                </div>
                            </div>

                            <div className="mb-7">
                                <label htmlFor="category" className="block font-[OB] text-[14px]">Категория</label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="mt-1 block w-[50vw] h-[30px] text-black rounded-xl pl-3 pr-[40px] appearance-none text-[14px] z-10"
                                    >
                                        <option value="">Выберите товар</option>
                                        <option value="him">Химия</option>
                                        <option value="org">Органика</option>
                                    </select>
                                    <span className="absolute right-[12px] top-[50%] transform -translate-y-1/2 pointer-events-none">
                                        <img src="../public/arrow.svg" alt="Стрелка" />
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-[50vw] h-[30px] text-white rounded-xl font-[OSB] text-[14px] z-10"
                                style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}
                            >
                                поиск
                            </button>
                        </form>

                        <div ref={workItemsRef} className="flex flex-col justify-center items-center flex-wrap mt-14">
                            {
                                works.length === 0 ?

                                    <div className="flex items-center justify-center h-72 w-full">
                                        <p className='text-white font-[OB] text-xl'>Ничего не найдено</p>
                                    </div>

                                    :

                                    works.sort((a, b) => a.position_numer - b.position_numer)
                                        .map(work => (
                                            <MobileWorkItem
                                                key={work.id}
                                                name={work.name}
                                                city={work.city}
                                                category={work.category}
                                                zalog={work.zalog}
                                                text={work.text}
                                                photo={work.photo}
                                                link={work.link}
                                                id={work.id}
                                            />
                                        ))
                            }
                        </div>
                    </div>
                </div>

                :

                <div className="mt-36 relative pb-36">
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute left-[10vw] top-[15vh]" style={{ boxShadow: "0px 0px 120px 150px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute right-[0vw] top-[25vh]" style={{ boxShadow: "0px 0px 140px 180px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute right-[0vw] top-[80vh]" style={{ boxShadow: "0px 0px 120px 150px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute left-[0vw] top-[90vh]" style={{ boxShadow: "0px 0px 120px 150px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="flex flex-col items-center">
                        <p className='font-[OB] text-[54px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>BRAND HUNTER</p>
                        <p className="text-[20px] mt-2">Нужна помощь в трудоустройстве?</p>
                        <p className="text-[18px] w-[30vw] text-center mt-6" style={{ whiteSpace: "normal" }}>Воспользуйся <span style={{ position: 'relative', display: 'inline-block' }}>
                            быстрым
                            <span style={{
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                                height: '2px',
                                width: '100%',
                                background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)',
                                zIndex: -1,
                            }} />
                        </span> поиском или спустись ниже, чтобы открыть расширенный поиск.</p>
                        <form onSubmit={handleSubmit} className="px-[8vw] flex flex-wrap justify-center items-center mt-11">
                            <div className="mr-6 relative">
                                <img src="../public/lupa.svg" alt="" className="absolute top-[25%] left-[18px]" />
                                <input
                                    type="text"
                                    id="searchTerm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-[500px] h-[63px] rounded-full text-center text-[20px] bg-transparent border-[1.5px] text-white"
                                    placeholder="Введите название должности"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-[167px] h-[63px] text-white rounded-full font-[OSB] text-[22px]"
                                style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                            >
                                найти
                            </button>
                        </form>
                    </div>
                    <img src="../public/WorkBG.svg" alt="" className="w-[100vw] mt-32 " />
                    <button
                        type='button'
                        onClick={() => fetchWorksStart()}
                        className="w-[40vw] h-[40px] text-[#0035EF] font-[OSB] text-[14px] mt-40"
                    >
                        сбросить фильтры
                    </button>
                    <div className="flex mt-3">
                        <form onSubmit={handleSubmit} className="pl-[8vw] pr-[4vw] flex flex-col flex-wrap items-center ">
                            <div className="mb-6">
                                <label htmlFor="city" className="block font-[OB]">Город</label>
                                <div className="relative">
                                    <select
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="mt-1 block w-[280px] h-[40px] text-black rounded-xl pl-3 pr-[40px] appearance-none"
                                    >
                                        <option value="">Выберите город</option>
                                        <option value="ast">Астана</option>
                                        <option value="alm">Алматы</option>
                                        <option value="kar">Караганда</option>
                                    </select>
                                    <span className="absolute right-[12px] top-[50%] transform -translate-y-1/2 pointer-events-none">
                                        <img src="../public/arrow.svg" alt="Стрелка" />
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="position" className="block font-[OB]">Должность</label>
                                <div className="relative">
                                    <select
                                        id="position"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        className="mt-1 block w-[280px] h-[40px] text-black rounded-xl pl-3 pr-[40px] appearance-none"
                                    >
                                        <option value="">Выберите должность</option>
                                        <option value="oper">Оператор</option>
                                        <option value="zakl">Закладчик</option>
                                        <option value="traf">Трафаретчик</option>
                                        <option value="adm">Администратор</option>
                                    </select>
                                    <span className="absolute right-[12px] top-[50%] transform -translate-y-1/2 pointer-events-none">
                                        <img src="../public/arrow.svg" alt="Стрелка" />
                                    </span>
                                </div>
                            </div>

                            <div className="mb-14">
                                <label htmlFor="category" className="block font-[OB]">Категория</label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="mt-1 block w-[280px] h-[40px] text-black rounded-xl pl-3 pr-[40px] appearance-none"
                                    >
                                        <option value="">Выберите товар</option>
                                        <option value="him">Химия</option>
                                        <option value="org">Органика</option>
                                    </select>
                                    <span className="absolute right-[12px] top-[50%] transform -translate-y-1/2 pointer-events-none">
                                        <img src="../public/arrow.svg" alt="Стрелка" />
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-[280px] h-[40px] text-white rounded-xl font-[OSB]"
                                style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}
                            >
                                поиск
                            </button>
                        </form>

                        <div ref={workItemsRef} className="flex flex-wrap ">
                            {
                                works.length === 0 ?
                                    <div className="flex items-center justify-center h-72 w-full">
                                        <p className='text-white font-[OB] text-xl'>Ничего не найдено</p>
                                    </div>
                                    :
                                    works.sort((a, b) => a.position_numer - b.position_numer)
                                        .map(work => (
                                            <WorkItem
                                                key={work.id}
                                                name={work.name}
                                                city={work.city}
                                                category={work.category}
                                                zalog={work.zalog}
                                                text={work.text}
                                                photo={work.photo}
                                                link={work.link}
                                                id={work.id}
                                            />
                                        ))
                            }
                        </div>
                    </div>
                </div>

            }
        </>
    );
};

export default Work;