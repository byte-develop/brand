import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import SalesItem from './SalesItem';
import { useMediaQuery } from 'react-responsive';

const Sales = () => {

    const [city, setCity] = useState('')
    const [sales, setSales] = useState('')

    const fetchSales = async (e) => {
        e.preventDefault();
        const response = await axios.get('/api/sales', {
            params: {
                city,
            }
        });
        setSales(response.data);
        console.log(response.data)
    }

    const fetchSalesStart = async () => {
        setCity('')

        try {
            const response = await fetch('/api/sales');
            const data = await response.json();
            setSales(data);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchSalesStart();
    }, []);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <>
            {

                isMobile ?

                    <div className='flex flex-col items-center justify-center mb-20'>
                        <div className="flex flex-col mt-10 w-full justify-center items-center">
                            <img src="../public/sales2.png" alt="" className=' w-full' />
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex flex-col w-[80%] items-start">
                                    <p className='font-[OEB] text-[40px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>АКЦИИ</p>
                                    <div className="flex flex-col items-center">
                                        <p className='font-[OLB] text-[20px]'>С Brand всегда выгоднее</p>
                                        <div className="bg-[#120082] w-full h-[4px] rounded-full"></div>
                                    </div>
                                    <p className='text-[16px] w-[70%] mt-5' style={{ whiteSpace: "normal" }}>Теперь все акции магазинов собраны
                                        в одном месте. Достаточно выбрать нужный город и нажать “поиск”.</p>
                                </div>


                                <form onSubmit={fetchSales} className="flex flex-wrap justify-center items-center mt-8 relative">
                                    <div className="">
                                        <label htmlFor="city" className="block font-[OB] text-[16px]">Город</label>
                                        <div className="flex items-center mt-2">
                                            <div className="relative">
                                                <select
                                                    id="city"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    className="block h-[32px] w-[173px] text-black rounded-lg pl-3 pr-[40px] appearance-none text-[14px] z-10"
                                                    required
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
                                            <div className="flex flex-col">
                                                <button
                                                    type='button'
                                                    onClick={() => fetchSalesStart()}
                                                    className="text-[#0035EF] font-[OSB] text-[12px] absolute top-0 right-0"
                                                >
                                                    сбросить фильтры
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="w-[132px] h-[32px] text-white rounded-lg font-[OSB] text-[14px] ml-4"
                                                    style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                                                >
                                                    поиск
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="flex flex-col items-center w-full gap-12 justify-center mt-20">
                            {
                                sales.length == 0 ?

                                    <div className="flex items-center justify-center h-72 w-full">
                                        <p className='text-white font-[OB] text-xl'>Ничего не найдено</p>
                                    </div>

                                    :

                                    sales.map(sale => (
                                        <SalesItem
                                            photo={sale.photo_mobile}
                                            key={sale.id}
                                            name={sale.name}
                                            text={sale.text}
                                            links={sale.links}
                                            color={sale.color}
                                        />
                                    ))



                            }
                        </div>
                    </div>

                    :

                    <div className='flex flex-col items-center justify-center mb-20'>
                        <div className="flex mt-10 w-full justify-around">
                            <img src="../public/sales.png" alt="" className='' />
                            <div className="w-[49%] flex flex-col items-start justify-center">
                                <p className='font-[OEB] text-[64px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>АКЦИИ</p>
                                <div className="flex flex-col items-center">
                                    <p className='font-[OLB] text-[32px]'>С Brand всегда выгоднее</p>
                                    <div className="bg-[#120082] w-full h-[4px] rounded-full"></div>
                                </div>
                                <p className='text-[32px] w-[70%] mt-5' style={{ whiteSpace: "normal" }}>Теперь все акции магазинов собраны
                                    в одном месте. Достаточно выбрать нужный город и нажать “поиск”.</p>


                                <form onSubmit={fetchSales} className="flex flex-wrap justify-center items-center mt-8 relative">
                                    <div className="">
                                        <label htmlFor="city" className="block font-[OB] text-[32px]">Город</label>
                                        <div className="flex items-center mt-5">
                                            <div className="relative">
                                                <select
                                                    id="city"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    className="mt-1 block h-[64px] w-[346px] text-black rounded-2xl pl-3 pr-[40px] appearance-none text-[24px] z-10"
                                                    required
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
                                            <div className=" flex flex-col">
                                                <button
                                                    type='button'
                                                    onClick={() => fetchSalesStart()}
                                                    className="text-[#0035EF] font-[OSB] text-[14px] absolute top-0 right-0"
                                                >
                                                    сбросить фильтры
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="w-[265px] h-[64px] text-white rounded-2xl font-[OSB] text-[22px] ml-4"
                                                    style={{ background: "linear-gradient(90deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 25%, rgba(25,73,196,1) 75%, rgba(12,0,86,1) 100%)" }}
                                                >
                                                    поиск
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="flex flex-col items-center w-full gap-12 justify-center mt-20">
                            {
                                sales.length == 0 ?

                                    <div className="flex items-center justify-center h-72 w-full">
                                        <p className='text-white font-[OB] text-xl'>Ничего не найдено</p>
                                    </div>

                                    :

                                    sales.map(sale => (
                                        <SalesItem
                                            photo={sale.photo}
                                            key={sale.id}
                                            name={sale.name}
                                            text={sale.text}
                                            links={sale.links}
                                            color={sale.color}
                                        />
                                    ))



                            }
                        </div>
                    </div>

            }
        </>
    )
}

export default Sales