import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import HelpItem from './HelpItem';
import HelpItemMobile from './HelpItemMobile';

const Help = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const [Data, setData] = useState([])

    useEffect(() => {
        const GetData = async () => {
            try {
                const response = await fetch('/api/admins', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                setData(data);
                console.log(data)
            } catch (error) {

            }
        };
        GetData()
    }, []);

    return (
        <>
            {isMobile ?

                <div className='w-[100vw] flex items-center flex-col mt-12 relative mb-20'>
                    <div className="flex items-center flex-col">
                        <p className='font-[OB] text-[30px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>НУЖНА ПОМОЩЬ?</p>
                        <p className='w-[75%] text-center text-[14px] mt-3 font-[OL]' style={{ whiteSpace: "normal" }}>Если вы столкнулись с какими-то проблемами или у вас есть вопросы, обращайтесь к нашей команде. Мы быстро <span style={{ position: 'relative', display: 'inline-block' }}>
                            всё уладим
                            <span style={{
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                                height: '2px',
                                width: '100%',
                                background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)',
                                zIndex: -1,
                            }} />
                        </span>.</p>
                        <div className="flex mt-14 flex-col items-center">
                            <img src="../help1.svg" alt="" />
                            <div className="flex">
                                <div className="flex flex-col items-center">
                                    <img src="../public/elem.png" alt="" className='h-[52px]' />
                                    <p className='text-[20px] font-[OSB] mt-3'>ELEMENT</p>
                                </div>
                                <div className="ml-12 flex flex-col items-center">
                                    <img src="../public/tg.png" alt="" className='h-[52px]' />
                                    <p className='text-[20px] font-[OSB] mt-3'>TELEGRAM</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className='font-[OB] text-[40px] mt-6 bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>1 ШАГ</p>
                                <p className='text-[16px] w-[300px] text-center' style={{ whiteSpace: "normal" }}>Выберите администратора, который отвечает за нужный вам чат.</p>
                            </div>
                            <div className="flex flex-col items-center mt-8">
                                <p className='font-[OB] text-[40px] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>2 ШАГ</p>
                                <p className='text-[16px] w-[300px] text-center' style={{ whiteSpace: "normal" }}>Нажмите на кнопку социальной сети, в которой хотите связаться с администратором.</p>
                            </div>


                            <div className="mt-36 flex flex-col items-center ">
                                <p className='font-[OEB] text-[30px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>АДМИНИСТРАТОРЫ</p>
                                <div className="flex mt-12 justify-center flex-wrap gap-4">
                                    {
                                        Data.length == 0 ?

                                            <div className="flex items-center justify-center h-72 w-full">
                                                <p className='text-white font-[OB] text-xl'>Ничего не найдено</p>
                                            </div>

                                            :

                                            Data.map(data => (
                                                <HelpItemMobile
                                                    key={data.id}
                                                    name={data.name}
                                                    branch={data.Branch}
                                                    photo={data.photo}
                                                    telegram={data.telegram}
                                                    element={data.element}
                                                />
                                            ))



                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                :

                <div className='flex items-center flex-col mt-12 relative pb-60'>
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute left-[15vw] top-[15vh]" style={{ boxShadow: "0px 0px 100px 120px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute right-[15vw] top-[25vh]" style={{ boxShadow: "0px 0px 100px 120px rgba(0, 40, 184, 0.5)" }}></div>
                    <img src="../public/bghelp1.svg" className="absolute left-[10vw] top-[5vh]" alt="" />
                    <img src="../public/bghelp2.svg" className="absolute right-[5vw]" alt="" />
                    <img src="../public/bghelp3.svg" className="absolute left-[5vw] top-[35vh]" alt="" />
                    <img src="../public/bghelp4.svg" className="absolute right-[5vw] top-[40vh]" alt="" />

                    <div className="flex items-center flex-col">
                        <p className='font-[OB] text-[54px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>НУЖНА ПОМОЩЬ?</p>
                        <p className='w-[700px] text-center text-[18px] mt-3' style={{ whiteSpace: "normal" }}>Если вы столкнулись с какими-то проблемами или у вас есть вопросы, обращайтесь к нашей команде. Мы быстро <span style={{ position: 'relative', display: 'inline-block' }}>
                            всё уладим
                            <span style={{
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                                height: '2px',
                                width: '100%',
                                background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)',
                                zIndex: -1,
                            }} />
                        </span>.</p>

                        <div className="flex items-center">
                            <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-14">
                                <div className="flex items-center justify-end r">
                                    <img src="../help1.svg" alt="" className='r' />
                                </div>
                                <div className="l flex flex-col justify-center">
                                    <p className='font-[OB] text-[64px] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>1 ШАГ</p>
                                    <p className='text-[20px] w-[400px]' style={{ whiteSpace: "normal" }}>Выберите администратора, который отвечает за нужный вам чат.</p>
                                </div>
                                <div className="flex items-center r mt-5 w-[386px] justify-center">
                                    <div className="flex flex-col items-center">
                                        <img src="../public/elem.png" alt="" className='h-[92px]' />
                                        <p className='text-[20px] font-[OSB] mt-3'>ELEMENT</p>
                                    </div>
                                    <div className="ml-12 flex flex-col items-center">
                                        <img src="../public/tg.png" alt="" className='h-[92px]' />
                                        <p className='text-[20px] font-[OSB] mt-3'>TELEGRAM</p>
                                    </div>
                                </div>
                                <div className="l flex flex-col justify-center">
                                    <p className='font-[OB] text-[64px] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>2 ШАГ</p>
                                    <p className='text-[20px] w-[400px]' style={{ whiteSpace: "normal" }}>Нажмите на кнопку социальной сети, в которой хотите связаться с администратором.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-36 flex flex-col items-center  mb-14">
                        <p className='font-[OEB] text-[54px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>АДМИНИСТРАТОРЫ</p>
                        <div className="flex mt-12 gap-6 flex-wrap justify-center w-[80%]">
                            {
                                Data.length === 0 ?
                                    <div className="flex items-center justify-center h-72 w-full">
                                        <p className='text-white font-[OB] text-xl'>Ничего не найдено</p>
                                    </div>
                                    :
                                    <>
                                        <div className="flex gap-6 mb-4 w-full justify-center">
                                            {Data.slice(0, 2).map(data => (
                                                <HelpItem
                                                    key={data.id}
                                                    name={data.name}
                                                    branch={data.Branch}
                                                    photo={data.photo}
                                                    telegram={data.telegram}
                                                    element={data.element}
                                                />
                                            ))}
                                        </div>

                                        {Data.slice(2).map(data => (
                                            <HelpItem
                                                key={data.id}
                                                name={data.name}
                                                branch={data.Branch}
                                                photo={data.photo}
                                                telegram={data.telegram}
                                                element={data.element}
                                            />
                                        ))}
                                    </>
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Help