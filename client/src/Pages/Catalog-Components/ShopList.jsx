import React, { useEffect, useState } from 'react';
import ShopItem from './ShopItem';
import "./shoplist.css"
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import MobileShopItem from './MobileShopItem';

const ShopList = () => {
    const [shops, setShops] = useState([]);
    const [category, setCategory] = useState('');
    const [city, setCity] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const fetchShops = async () => {
        const cityall = city + category
        console.log(cityall)
        const response = await axios.get('/api/shops', {
            params: {
                cityall,
                searchTerm,
            }
        });
        if (city || searchTerm) {
            const sortShops = response.data.sort((a, b) => a.position - b.position);
            setShops(sortShops);
        } else {
            setShops(response.data);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('filters', JSON.stringify({ category, city, searchTerm }));
        fetchShops();
    }

    const fetchShopsStart = async () => {
        try {
            const response = await fetch('/api/shops?recommended=true', {
                method: 'GET',
            });
            const data = await response.json();
            setShops(data);
        } catch (error) {
            console.error('Ошибка при загрузке магазинов:', error);
        }
    };

    const fetchShopsStartNull = async () => {
        setCategory('')
        setCity('')
        setSearchTerm('')
        localStorage.removeItem('filters');
        try {
            const response = await fetch('/api/shops?recommended=true', {
                method: 'GET',
            });
            const data = await response.json();
            setShops(data);
        } catch (error) {
            console.error('Ошибка при загрузке магазинов:', error);
        }
    };

    useEffect(() => {
        fetchShopsStart();
    }, []);

    useEffect(() => {
        const savedFilters = JSON.parse(localStorage.getItem('filters'));
        if (savedFilters) {
            setCategory(savedFilters.category || '');
            setCity(savedFilters.city || '');
            setSearchTerm(savedFilters.searchTerm || '');
        }
    }, []);

    return (
        <>
            {isMobile ?


                <div className='z-50 mt-10'>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-between">
                        <div className="flex justify-end w-full mr-14">
                            <button
                                type='button'
                                onClick={() => fetchShopsStartNull()}
                                className="w-[40vw] h-[40px] text-[#0035EF] font-[OSB] text-[14px]"
                            >
                                сбросить фильтры
                            </button>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="category" className="block font-[OB]">Категория</label>
                            <div className="relative">
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-[80vw] h-[40px] text-black rounded-xl pl-3 pr-[40px] appearance-none"
                                    required={!searchTerm}
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

                        <div className="mb-4">
                            <label htmlFor="city" className="block font-[OB]">Город</label>
                            <div className="relative">
                                <select
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="mt-1 block w-[80vw] h-[40px] text-black rounded-xl pl-3 pr-[40px] appearance-none"
                                    required={!searchTerm}
                                >
                                    <option value="">Выберите город</option>
                                    <option value="ast">Астана</option>
                                    <option value="alm">Алматы</option>
                                    <option value="kar">Караганда</option>

                                    <option value="sem">Семей</option>
                                    <option value="step">Степногорск</option>

                                    <option value="acs">Аксай</option>

                                    <option value="shu">Щучинск</option>

                                    <option value="bor">Боровое</option>

                                    <option value="uct">Усть-Каменогорск</option>

                                    <option value="eke">Экибастуз</option>

                                    <option value="tur">Туркестан</option>

                                    <option value="tem">Темиртау</option>

                                    <option value="tal">Талдыкорган</option>

                                    <option value="tar">Тараз</option>

                                    <option value="akt">Актау</option>

                                    <option value="ati">Атырау</option>

                                    <option value="act">Актобе</option>

                                    <option value="kok">Кокшетау</option>

                                    <option value="pav">Павлодар</option>

                                    <option value="shi">Шымкент</option>

                                    <option value="kos">Костанай</option>

                                    <option value="ura">Уральск</option>

                                    <option value="kap">Капчагай</option>

                                    <option value="pet">Петропавловск</option>
                                </select>
                                <span className="absolute right-[12px] top-[50%] transform -translate-y-1/2 pointer-events-none">
                                    <img src="../public/arrow.svg" alt="Стрелка" />
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="searchTerm" className="block font-[OB]" >Поиск по названию</label>
                            <input
                                type="text"
                                id="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mt-1 block w-[80vw] h-[40px] text-black rounded-xl pl-3"
                                placeholder="Введите название магазина"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-[40vw] h-[40px] text-white rounded-xl font-[OSB] mt-5"
                            style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}
                        >
                            поиск
                        </button>
                    </form>


                    <div className="flex flex-wrap pb-24 w-full gap-3 justify-center mt-[5vh]">
                        {
                            shops.length == 0 ?

                                <div className="flex items-center justify-center h-72 w-full">
                                    <p className='text-white font-[OB] text-xl'>Ничего не найдено</p>
                                </div>

                                :

                                shops.map(shop => (
                                    <MobileShopItem
                                        key={shop.id}
                                        name={shop.name}
                                        slogan={shop.slogan}
                                        rating={shop.rating}
                                        photo={shop.photo}
                                        id={shop.id}
                                        recommended={shop.recommended}
                                    />
                                ))



                        }
                    </div>
                </div>

                :

                <div className='z-50'>
                    <form onSubmit={handleSubmit} className="px-[8vw] flex flex-wrap items-center justify-between mt-20 ">
                        <div className="w-full flex justify-end mr-32">
                            <button
                                type='button'
                                onClick={() => fetchShopsStartNull()}
                                className="w-[40vw] h-[40px] text-[#0035EF] font-[OSB] text-[16px]"
                            >
                                сбросить фильтры
                            </button>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="category" className="block font-[OB]">Категория</label>
                            <div className="relative">
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-[280px] h-[40px] text-black rounded-xl pl-3 pr-[40px] appearance-none"
                                    required={!searchTerm}
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

                        <div className="mb-4">
                            <label htmlFor="city" className="block font-[OB]">Город</label>
                            <div className="relative">
                                <select
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="mt-1 block w-[280px] h-[40px] text-black rounded-xl pl-3 pr-[40px] appearance-none"
                                    required={!searchTerm}
                                >
                                    <option value="">Выберите город</option>
                                    <option value="ast">Астана</option>
                                    <option value="alm">Алматы</option>
                                    <option value="kar">Караганда</option>

                                    <option value="sem">Семей</option>

                                    <option value="acs">Аксай</option>

                                    <option value="shu">Щучинск</option>

                                    <option value="bor">Боровое</option>

                                    <option value="uct">Усть-Каменогорск</option>

                                    <option value="eke">Экибастуз</option>

                                    <option value="tur">Туркестан</option>
                                    <option value="step">Степногорск</option>
                                    <option value="tem">Темиртау</option>
                                    <option value="tal">Талдыкорган</option>

                                    <option value="tar">Тараз</option>

                                    <option value="akt">Актау</option>

                                    <option value="ati">Атырау</option>

                                    <option value="act">Актобе</option>

                                    <option value="kok">Кокшетау</option>

                                    <option value="pav">Павлодар</option>

                                    <option value="shi">Шымкент</option>

                                    <option value="kos">Костанай</option>

                                    <option value="ura">Уральск</option>

                                    <option value="kap">Капчагай</option>

                                    <option value="pet">Петропавловск</option>
                                </select>
                                <span className="absolute right-[12px] top-[50%] transform -translate-y-1/2 pointer-events-none">
                                    <img src="../public/arrow.svg" alt="Стрелка" />
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="searchTerm" className="block font-[OB]" >Поиск по названию</label>
                            <input
                                type="text"
                                id="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mt-1 block w-[280px] h-[40px] text-black rounded-xl pl-3"
                                placeholder="Введите название магазина"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-[280px] h-[40px] text-white rounded-xl font-[OSB]"
                            style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(12, 0, 86, 1) inset, 0px -2px 28px 2px rgba(97, 141, 255, 1)' }}
                        >
                            поиск
                        </button>
                    </form>

                    <div className="flex flex-wrap pb-24">
                        {
                            shops.length == 0 ?

                                <div className="flex items-center justify-center h-72 w-full">
                                    <p className='text-white font-[OB] text-xl'>Ничего не найдено</p>
                                </div>

                                :

                                shops.map(shop => (
                                    <ShopItem
                                        key={shop.id}
                                        name={shop.name}
                                        slogan={shop.slogan}
                                        rating={shop.rating}
                                        photo={shop.photo}
                                        id={shop.id}
                                        recommended={shop.recommended}
                                    />
                                ))



                        }
                    </div>
                </div>

            }
        </>
    );

};
export default ShopList;