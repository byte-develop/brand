import React from 'react'
import { useMediaQuery } from 'react-responsive';
import Numbers from './Numbers';
import ShopList from './ShopList';

const Slogan = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div className='relative z-50'>
      {isMobile ?

        <>
          <div className="bg-[#0028B8] bg-opacity-50 z-50 h-12 w-12 rounded-full absolute right-0 top-[20vh]" style={{ boxShadow: "0px 0px 80px 90px rgba(0, 40, 184, 0.5)" }}></div>
          <div className='font-[OB]  mt-[5%] z-50'>
            <p className='text-[23px]'><span className='text-[40px] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>ЗДЕСЬ</span> собраны</p>
            <p className='text-[23px] translate-x-[15%]'>все <span className='text-[40px] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>ВАШИ</span></p>
            <p className='text-[23px] translate-x-[10%]'>любимые <span className='text-[40px]'>ШОПЫ</span></p>
          </div>
        </>


        :


        <div className='absolute font-[OB] z-50 left-[5vw] mt-[10%]'>
          <p className='text-[54px]'><span className='text-[95px] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>ЗДЕСЬ</span> собраны</p>
          <p className='text-[54px] translate-x-[15%]'>все <span className='text-[95px] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>ВАШИ</span></p>
          <p className='text-[54px] translate-x-[10%]'>любимые <span className='text-[95px]'>ШОПЫ</span></p>
        </div>}
    </div>
  )
}

export default Slogan