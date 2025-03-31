import React from 'react'
import { useMediaQuery } from 'react-responsive';

const InDevelopment = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <>
            {isMobile ?

                <div className='flex flex-col items-center mx-[15%] mt-10 mb-20'>
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute rotate-45 left-[0] top-[30vh]" style={{ boxShadow: "0px 0px 80px 120px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute rotate-45 left-[20vw] bottom-0" style={{ boxShadow: "0px 0px 80px 120px rgba(0, 40, 184, 0.5)" }}></div>

                    <img className='absolute right-[0] top-[50vh] h-[247px]' src="../public/DevMan1.png" alt="" />
                    <img className='absolute left-[5vw] top-[70vh] w-[157px]' src="../public/DevShape1.png" alt="" />
                    <p className=' font-[OB] text-[30px] text-transparent text-center z-10' style={{ whiteSpace: "normal", backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>РАЗДЕЛ САЙТА НАХОДИТСЯ В <span className='text-transparent' style={{ whiteSpace: "normal", backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>РАЗРАБОТКЕ</span></p>
                    <p className='text-[20px] mt-6 text-center z-10' style={{ whiteSpace: "normal" }}>Скоро тут будет нечто <span style={{ position: 'relative', display: 'inline-block' }}>
                        интересное
                        <span style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            height: '2px',
                            width: '100%',
                            background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)',
                            zIndex: -1,
                        }} />
                    </span></p>
                </div>

                :

                <div className='flex flex-col items-center mx-[15%] mt-10 mb-20'>
                    <div className="bg-[#0028B8] bg-opacity-50 h-6 w-80 rounded-full absolute rotate-45 right-[0] top-[60vh]" style={{ boxShadow: "0px 0px 120px 150px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 h-6 w-80 rounded-full absolute rotate-[-45deg] left-[0] top-[50vh]" style={{ boxShadow: "0px 0px 120px 150px rgba(0, 40, 184, 0.5)" }}></div>
                    <div className="bg-[#0028B8] bg-opacity-50 h-6 w-96 rounded-full absolute bottom-0" style={{ boxShadow: "0px 0px 180px 210px rgba(0, 40, 184, 0.5)" }}></div>
                    <img className='absolute left-[20vw] top-[40vh]' src="../public/DevMan1.png" alt="" />
                    <img className='absolute left-[12vw] top-[60vh]' src="../public/DevShape1.png" alt="" />
                    <img className='absolute right-[20vw] top-[35vh]' src="../public/DevMan2.png" alt="" />
                    <img className='absolute right-[12vw] top-[55vh]' src="../public/DevShape2.png" alt="" />
                    <p className='mt-10 font-[OB] text-[64px] text-transparent text-center z-10' style={{ whiteSpace: "normal", backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>РАЗДЕЛ САЙТА НАХОДИТСЯ В <span className='text-transparent' style={{ whiteSpace: "normal", backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>РАЗРАБОТКЕ</span></p>
                    <p className='text-[22px] mt-14 z-10'>Скоро тут будет нечто <span style={{ position: 'relative', display: 'inline-block' }}>
                        интересное
                        <span style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            height: '2px',
                            width: '100%',
                            background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)',
                            zIndex: -1,
                        }} />
                    </span></p>
                </div>
            }
        </>
    )
}

export default InDevelopment