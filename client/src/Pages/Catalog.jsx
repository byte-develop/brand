import React, { useEffect, useState } from 'react'
import ShopsBG from './Catalog-Components/ShopBG'
import BrandBackground from './Catalog-Components/BrandBackground'
import Slogan from './Catalog-Components/Slogan'
import Numbers from './Catalog-Components/Numbers'
import ShopList from './Catalog-Components/ShopList'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import axios from 'axios';

const Catalog = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [catalogStartAds, setCatalogStartAds] = useState([]);
  const [catalogMiddleAds, setCatalogMiddleAds] = useState([]);
  const [catalogEndAds, setCatalogEndAds] = useState([]);

  useEffect(() => {
    const fetchAds1 = async () => {
      try {
        const catalogResponse = await axios.get('/api/ads/catalog_start');

        setCatalogStartAds(catalogResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAds1();
  }, []);

  useEffect(() => {
    const fetchAds2 = async () => {
      try {
        const catalogResponse = await axios.get('/api/ads/catalog_middle');

        setCatalogMiddleAds(catalogResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAds2();
  }, []);

  useEffect(() => {
    const fetchAds3 = async () => {
      try {
        const catalogResponse = await axios.get('/api/ads/catalog_end');

        setCatalogEndAds(catalogResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAds3();
  }, []);

  return (
    <>
      {isMobile ?

        <div className='flex flex-col items-center'>
          <Slogan />
          <ShopsBG />
          <BrandBackground />
          <>
            {
              catalogStartAds.length === 0 ?

                <div className="flex items-center justify-center z-50 relative w-[95%] flex-col mt-20">
                  <p className='z-10 font-[IJ] text-[20px] w-[80%] text-center' style={{ whiteSpace: "normal" }}>Тут могла быть ваша реклама</p>
                  <button className='z-10 font-[IJ] text-[12px] w-[80px] h-[30px] bg-[#9E1BC8] rounded-xl border-[#9E1BC8] border-[1px] border-opacity-70 mt-2' style={{ background: "url(../public/BBG.png)" }}>
                    <Link to={"/help"}>
                      ЗАКАЗАТЬ
                    </Link>
                  </button>
                  <img src="../public/ad.png" alt="" className='absolute w-[95%] rounded-3xl' />
                </div>

                :

                <div className="flex w-[95vw] items-center justify-center z-50 relative h-[125px] mt-8 flex-col">
                  <div className="relative z-10 flex items-center w-[384px] justify-between">
                    <p className='ml-2 text-[14px] font-[OB] w-[30%] text-center' style={{ whiteSpace: "normal" }}>{catalogStartAds[0].name}</p>
                    <Link to={catalogStartAds[0].link} className='flex items-center justify-center z-10 mr-4 font-[OB] text-[14px] w-[88px] h-[26px] rounded-3xl border-opacity-70' style={{ background: catalogStartAds[0].color ? catalogStartAds[0].color : "rgb(110, 0, 0)" }}>
                      Перейти
                    </Link>
                  </div>
                  <img src={catalogStartAds[0].background} alt="" className='absolute h-[125px] rounded-3xl' />
                </div>
            }
                        {
              catalogMiddleAds.length === 0 ?

                <div className="flex items-center justify-center z-50 relative w-[95%] flex-col mt-20">
                  <p className='z-10 font-[IJ] text-[20px] w-[80%] text-center' style={{ whiteSpace: "normal" }}>Тут могла быть ваша реклама</p>
                  <button className='z-10 font-[IJ] text-[12px] w-[80px] h-[30px] bg-[#9E1BC8] rounded-xl border-[#9E1BC8] border-[1px] border-opacity-70 mt-2' style={{ background: "url(../public/BBG.png)" }}>
                    <Link to={"/help"}>
                      ЗАКАЗАТЬ
                    </Link>
                  </button>
                  <img src="../public/ad.png" alt="" className='absolute w-[95%] rounded-3xl' />
                </div>

                :

                <div className="flex w-[95vw] items-center justify-center z-50 relative h-[125px] mt-8 flex-col">
                  <div className="relative z-10 flex items-center w-[384px] justify-between">
                    <p className='ml-2 text-[14px] font-[OB] w-[30%] text-center' style={{ whiteSpace: "normal" }}>{catalogMiddleAds[0].name}</p>
                    <Link to={catalogMiddleAds[0].link} className='flex items-center justify-center z-10 mr-4 font-[OB] text-[14px] w-[88px] h-[26px] rounded-3xl border-opacity-70' style={{ background: catalogStartAds[0].color ? catalogStartAds[0].color : "rgb(110, 0, 0)" }}>
                      Перейти
                    </Link>
                  </div>
                  <img src={catalogMiddleAds[0].background} alt="" className='absolute h-[125px] rounded-3xl' />
                </div>
            }
                        {
              catalogEndAds.length === 0 ?

                <div className="flex items-center justify-center z-50 relative w-[95%] flex-col mt-20">
                  <p className='z-10 font-[IJ] text-[20px] w-[80%] text-center' style={{ whiteSpace: "normal" }}>Тут могла быть ваша реклама</p>
                  <button className='z-10 font-[IJ] text-[12px] w-[80px] h-[30px] bg-[#9E1BC8] rounded-xl border-[#9E1BC8] border-[1px] border-opacity-70 mt-2' style={{ background: "url(../public/BBG.png)" }}>
                    <Link to={"/help "}> 
                      ЗАКАЗАТЬ
                    </Link>
                  </button>
                  <img src="../public/ad.png" alt="" className='absolute w-[95%] rounded-3xl' />
                </div>

                :

                <div className="flex w-[95vw] items-center justify-center z-50 relative h-[125px] mt-8 flex-col">
                  <div className="relative z-10 flex items-center w-[384px] justify-between">
                    <p className='ml-2 text-[14px] font-[OB] w-[30%] text-center' style={{ whiteSpace: "normal" }}>{catalogEndAds[0].name}</p>
                    <Link to={catalogEndAds[0].link} className='flex items-center justify-center z-10 mr-4 font-[OB] text-[14px] w-[88px] h-[26px] rounded-3xl border-opacity-70' style={{ background: catalogStartAds[0].color ? catalogStartAds[0].color : "rgb(110, 0, 0)" }}>
                      Перейти
                    </Link>
                  </div>
                  <img src={catalogEndAds[0].background} alt="" className='absolute h-[125px] rounded-3xl' />
                </div>
            }
          </>
          <ShopList />
        </div>

        :

        <>
          <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute right-0 top-[110vh]" style={{ boxShadow: "0px 0px 80px 90px rgba(0, 40, 184, 0.5)" }}></div>
          <Slogan />
          <BrandBackground />
          <ShopsBG />
          <Numbers />
          <>
            {
              catalogStartAds.length === 0 ?

                <div className="flex w-full items-center justify-center z-50 relative h-[450px] mt-20 flex-col">
                  <p className='z-10 font-[IJ] text-[64px] w-[80%] text-center' style={{ whiteSpace: "normal" }}>Тут могла быть ваша реклама</p>
                  <Link to={"/help"} className='flex items-center justify-center z-10 font-[IJ] text-[28px] w-[255px] h-[76px] bg-[#9E1BC8] rounded-3xl border-[#9E1BC8] border-[1px] border-opacity-70' style={{ background: "url(../public/BBG.png)" }}>
                    ЗАКАЗАТЬ
                  </Link>
                  <img src="../public/ad.png" alt="" className='absolute h-[450px] rounded-3xl' />
                </div>

                :

                <div className="flex w-full items-center justify-center z-50 relative h-[361px] mt-20 flex-col">
                  <div className="relative z-10 flex items-center w-[1106px] justify-between">
                    <p className='ml-6 text-[40px] font-[OB] w-[30%] text-center' style={{ whiteSpace: "normal" }}>{catalogStartAds[0].name}</p>
                    <Link to={catalogStartAds[0].link} className='flex items-center justify-center z-10 mr-16 font-[OB] text-[30px] w-[255px] h-[76px] rounded-3xl border-opacity-70' style={{ background: catalogStartAds[0].color ? catalogStartAds[0].color : "rgb(110, 0, 0)" }}>
                      Перейти
                    </Link>
                  </div>
                  <img src={catalogStartAds[0].background} alt="" className='absolute h-full rounded-3xl' />
                </div>
            }
          </>
          <>
            {
              catalogMiddleAds.length === 0 ?

                <div className="flex w-full items-center justify-center z-50 relative h-[450px] mt-20 flex-col">
                  <p className='z-10 font-[IJ] text-[64px] w-[80%] text-center' style={{ whiteSpace: "normal" }}>Тут могла быть ваша реклама</p>
                  <Link to={"/help"} className='flex items-center justify-center z-10 font-[IJ] text-[28px] w-[255px] h-[76px] bg-[#9E1BC8] rounded-3xl border-[#9E1BC8] border-[1px] border-opacity-70' style={{ background: "url(../public/BBG.png)" }}>
                    ЗАКАЗАТЬ
                  </Link>
                  <img src="../public/ad.png" alt="" className='absolute h-[450px] rounded-3xl' />
                </div>

                :

                <div className="flex w-full items-center justify-center z-50 relative h-[361px] mt-20 flex-col">
                  <div className="relative z-10 flex items-center w-[1106px] justify-between">
                    <p className='ml-6 text-[40px] font-[OB] w-[30%] text-center' style={{ whiteSpace: "normal" }}>{catalogMiddleAds[0].name}</p>
                    <Link to={catalogMiddleAds[0].link} className='flex items-center justify-center z-10 mr-16 font-[OB] text-[30px] w-[255px] h-[76px] rounded-3xl border-opacity-70' style={{ background: catalogStartAds[0].color ? catalogStartAds[0].color : "rgb(110, 0, 0)" }}>
                      Перейти
                    </Link>
                  </div>
                  <img src={catalogMiddleAds[0].background} alt="" className='absolute h-full rounded-3xl' />
                </div>
            }
          </>
          <>
            {
              catalogEndAds.length === 0 ?

                <div className="flex w-full items-center justify-center z-50 relative h-[450px] mt-20 flex-col">
                  <p className='z-10 font-[IJ] text-[64px] w-[80%] text-center' style={{ whiteSpace: "normal" }}>Тут могла быть ваша реклама</p>
                  <Link to={"/help"} className='flex items-center justify-center z-10 font-[IJ] text-[28px] w-[255px] h-[76px] bg-[#9E1BC8] rounded-3xl border-[#9E1BC8] border-[1px] border-opacity-70' style={{ background: "url(../public/BBG.png)" }}>
                    ЗАКАЗАТЬ
                  </Link>
                  <img src="../public/ad.png" alt="" className='absolute h-[450px] rounded-3xl' />
                </div>

                :

                <div className="flex w-full items-center justify-center z-50 relative h-[361px] mt-20 flex-col">
                  <div className="relative z-10 flex items-center w-[1106px] justify-between">
                    <p className='ml-6 text-[40px] font-[OB] w-[30%] text-center' style={{ whiteSpace: "normal" }}>{catalogEndAds[0].name}</p>
                    <Link to={catalogEndAds[0].link} className='flex items-center justify-center z-10 mr-16 font-[OB] text-[30px] w-[255px] h-[76px] rounded-3xl border-opacity-70' style={{ background: catalogStartAds[0].color ? catalogStartAds[0].color : "rgb(110, 0, 0)" }}>
                      Перейти
                    </Link>
                  </div>
                  <img src={catalogEndAds[0].background} alt="" className='absolute h-full rounded-3xl' />
                </div>
            }
          </>
          <ShopList />
        </>

      }

    </>
  )
}

export default Catalog