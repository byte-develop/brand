import React from 'react';
import './BrandBackground.css';
import { useMediaQuery } from 'react-responsive';

const BrandBackground = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


  return (

    <>
      {isMobile ?

        <div className='absolute left-0 overflow-hidden top-20 z-40'>
          <div className="flex animate-marquee-left">
            <img src="../public/BRAND.png" alt="" className='ml-[8vw] h-[70px]' />
            <img src="../public/BRAND.png" alt="" className='ml-[8vw] h-[70px]' />
          </div>

          <div className="flex animate-marquee-right">
            <img src="../public/BRAND2.png" alt="" className='mt-9 ml-[8vw] h-[70px]' />
            <img src="../public/BRAND2.png" alt="" className='mt-9 ml-[8vw] h-[70px]' />
          </div>

          <div className="flex animate-marquee-left">
            <img src="../public/BRAND3.png" alt="" className='mt-9 ml-[6vw] h-[70px]' />
            <img src="../public/BRAND3.png" alt="" className='mt-9 ml-[6vw] h-[70px]' />
          </div>

          <div className="flex animate-marquee-right">
            <img src="../public/BRAND4.png" alt="" className='mt-9 ml-[1vw] h-[70px]' />
            <img src="../public/BRAND4.png" alt="" className='mt-9 ml-[6vw] h-[70px]' />
          </div>
        </div>

        :

        <div className='absolute mt-28 left-0 overflow-hidden z-40'>
          <div className="flex animate-marquee-left">
            <img src="../public/BRAND.png" alt="" className='w-[32vw] ml-[8vw]' />
            <img src="../public/BRAND.png" alt="" className='w-[32vw] ml-[8vw]' />
          </div>

          <div className="flex animate-marquee-right">
            <img src="../public/BRAND2.png" alt="" className='w-[32vw] mt-9 ml-[8vw]' />
            <img src="../public/BRAND2.png" alt="" className='w-[32vw] mt-9 ml-[8vw]' />
          </div>

          <div className="flex animate-marquee-left">
            <img src="../public/BRAND3.png" alt="" className='w-[32vw] mt-9 ml-[6vw]' />
            <img src="../public/BRAND3.png" alt="" className='w-[32vw] mt-9 ml-[6vw]' />
          </div>

          <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute translate-y-[-100%]" style={{ boxShadow: "0px 0px 80px 90px rgba(0, 40, 184, 0.5)" }}></div>

          <div className="flex animate-marquee-right">
            <img src="../public/BRAND4.png" alt="" className='w-[32vw] mt-9 ml-[1vw]' />
            <img src="../public/BRAND4.png" alt="" className='w-[32vw] mt-9 ml-[6vw]' />
          </div>
        </div>}
    </>
  )
}

export default BrandBackground;