import React from 'react'
import { useMediaQuery } from 'react-responsive';
import ShopList from './ShopList';

const Numbers = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <>
            {isMobile ?

                <>
                    <div className="">
                        <div className="flex gap-8 mt-5 ml-[7vw]">
                            <div className="flex flex-col items-center">
                                <p className='font-[OB] text-[40px] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>200+</p>
                                <p className='font-[OSB] text-[14px]'>Магазинов</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className='font-[OB] text-[40px] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>40К+</p>
                                <p className='font-[OSB] text-[14px]'>Покупок</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className='font-[OB] text-[40px] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>10К</p>
                                <p className='font-[OSB] text-[14px]'>Клиентов</p>
                            </div>
                        </div>
                    </div>
                </>

                :

                <div className="flex gap-12 mt-[100vh] ml-[8vw]">
                    <div className="flex flex-col items-center">
                        <p className='font-[OB] text-5xl bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>200+</p>
                        <p className='font-[OSB]'>Магазинов</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className='font-[OB] text-5xl bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>40К+</p>
                        <p className='font-[OSB]'>Покупок</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className='font-[OB] text-5xl bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>10К</p>
                        <p className='font-[OSB]'>Клиентов</p>
                    </div>
                </div>}
        </>
    )
}

export default Numbers