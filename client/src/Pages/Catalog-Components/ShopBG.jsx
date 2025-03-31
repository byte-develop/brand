import React from 'react'
import "./shoplist.css"
import { useMediaQuery } from 'react-responsive';
import Numbers from './Numbers';
import ShopList from './ShopList';

const ShopsBG = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isMobile2 = useMediaQuery({ query: '(max-height: 700px)' });

  return (
    <>
      {
        isMobile ?

          <div className="right-0 mt-10 h-[500px] overflow-x-hidden z-50 ">
            <div className='flex items-center justify-center'>
              <div className="">
                <div className="flex items-center">
                  <img src="../public/shop1.svg" alt="" className="h-[25vw] " />
                  <img src="../public/shop2.svg" alt="" className='w-[25vw]' />
                  <img src="../public/shop3.svg" alt="" className='w-[25vw]' />
                </div>
                <div className="flex items-center mt-3 translate-x-[-%]">
                  <img src="../public/shop4.svg" alt="" className='w-[25vw]' />
                  <img src="../public/shop5.svg" alt="" className='w-[50vw] ' />
                </div>
                <div className="flex items-center mt-3 translate-x-[-15%]">
                  <img src="../public/shop6.svg" alt="" className='w-[50vw]' />
                  <img src="../public/shop7.svg" alt="" className='w-[25vw]' />
                </div>
              </div>
              <img src="../public/shop8.svg" alt="" className={`w-[50vw] translate-x-[50%]`} />
            </div>
            <Numbers />
          </div>

          :

          <div className="absolute right-0 mt-28 z-50">
            <div className='flex items-center'>
              <div className="translate-x-[45%]">
                <div className="flex items-center">
                  <img src="../public/shop1.svg" alt="" className="w-[13.5vw] min-w-[194px] s1 float1" />
                  <img src="../public/shop2.svg" alt="" className='w-[13.5vw] min-w-[194px] s2 float2' />
                  <img src="../public/shop3.svg" alt="" className='w-[13.5vw] min-w-[194px] s3 float3' />
                </div>
                <div className="flex items-center mt-3 translate-x-[-10%]">
                  <img src="../public/shop4.svg" alt="" className='w-[13.5vw] min-w-[194px] s4 float4' />
                  <img src="../public/shop5.svg" alt="" className='w-[27.5vw] min-w-[396px] s5 float5' />
                </div>
                <div className="flex items-center mt-3 translate-x-[-15%]">
                  <img src="../public/shop6.svg" alt="" className='w-[26.5vw] min-w-[384px] s6 float6' />
                  <img src="../public/shop7.svg" alt="" className='w-[13.5vw] min-w-[194px] s7 float7' />
                </div>
              </div>
              <img src="../public/shop8.svg" alt="" className='h-[30vw] min-h-[436px] translate-x-[250px] s8 float8' />
            </div>
          </div>

      }
    </>
  );
};

export default ShopsBG