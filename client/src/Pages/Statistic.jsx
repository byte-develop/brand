import React, { useEffect, useState } from 'react'
import { Pie } from "react-chartjs-2";
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import KazakhstanMap from './KazakhstanMap';
import * as am5xy from '@amcharts/amcharts5/xy';
import Chart from './Chart';
import HalfPieChart from './HalfPieChart';
import DraggableBarChart from './DraggableBarChart';
import axios from 'axios';

const Statistic = () => {
  const userAuth = 5000
  const userNoAuth = 12000

  const visitorData = {
    "Almaty": 1000,
  };

  const week = {
    mon: 100,
    tue: 132,
    wed: 54,
    thu: 111,
    fri: 79,
    sat: 180,
    sun: 209
  }

  const pieChartData = {
    labels: ["Пользователи с регистрацией", "Пользователи без регистрации"],
    datasets: [{
      data: [userAuth, userNoAuth],
      backgroundColor: ["#9BCFFF", "#0035EF"],
      hoverBackgroundColor: ["#3F96E7", "#001E89"],
      borderWidth: 0,
    }]
  };


  const maxValue = Math.max(...Object.values(week));

  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3002/tracking/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Ошибка получения статистики:', error);
      }
    };

    fetchStats();
  }, []);



  const [topPages, setTopPages] = useState([]);

  useEffect(() => {
    const fetchTopPages = async () => {
      try {
        const response = await axios.get('http://localhost:3002/tracking/top6');
        setTopPages(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Ошибка получения топ-страниц:', error);
      }
    };

    fetchTopPages();
  }, []);

  return (
    <div className='w-[100vw] h-auto flex justify-center'>
      <div className="w-full px-[15%] mt-14">
        <p className='text-[36px] font-[OB]'>Cтатистика сайта</p>
        <div className="flex items-center justify-between w-full mt-7">
          <div className="w-[32%] h-[120px] rounded-[20px] flex items-center justify-center" style={{ background: "linear-gradient(142deg, rgba(0,53,239,1) 0%, rgba(0,30,137,1) 100%)" }}>
            <div className="w-full p-6 flex flex-col items-start">
              <p className='text-[20px]'>Всего посещений</p>
              <div className="w-full flex items-center justify-between">
                <p className='font-[OB] text-[36px]'>5.000</p>
                <p className='flex items-center gap-3 text-[20px] font-[OB]'><span><img src="../public/arroww.png" alt="" /></span>21.5%</p>
              </div>
            </div>
          </div>
          <div className="w-[32%] h-[120px] rounded-[20px] bg-[#2B2B2B]">
            <div className="w-full p-6 flex flex-col items-start">
              <p className='text-[20px]'>Конверсия</p>
              <div className="w-full flex items-center justify-between">
                <p className='font-[OB] text-[36px]'>5.000</p>
                <p className='flex items-center gap-3 text-[20px] text-[#00C82F] font-[OB]'><span><img src="../public/arrowg.png" alt="" /></span>21.5%</p>
              </div>
            </div>
          </div>
          <div className="w-[32%] h-[120px] rounded-[20px] bg-[#2B2B2B]">
            <div className="w-full p-6 flex flex-col items-start">
              <p className='text-[20px]'>Уникальные посетители</p>
              <div className="w-full flex items-center justify-between">
                <p className='font-[OB] text-[36px]'>5.000</p>
                <p className='flex items-center gap-3 text-[20px] text-[#A70404] font-[OB]'><span><img src="../public/arrowr.png" alt="" /></span>21.5%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start justify-between w-full mt-7">
          <div className="w-[66%] h-[866px] bg-[#2B2B2B] rounded-[20px] p-8">
            <p className='text-[24px] font-[OSB] '>Пользователь на сайте <span className='text-[#0035EF]'>в среднем</span></p>
            <div className="mt-6 flex items-center justify-between w-full">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4">
                  <p className='text-[#828282] text-[20px]'><span className='text-[42px] text-white font-[OSB]'>0</span> ч</p>
                  <p className='text-[#828282] text-[20px]'><span className='text-[42px] text-white font-[OSB]'>18</span> м</p>
                </div>
                <p className='text-[20px]'>проводит</p>
              </div>

              <div className="flex flex-col items-center">
                <p className='text-[#828282] text-[20px]'><span className='text-[42px] text-white font-[OSB]'>3</span> стр.</p>
                <p className='text-[20px]'>посещает</p>
              </div>

              <div className="flex flex-col items-center">
                <p className='text-[#828282] text-[20px]'><span className='text-[42px] text-white font-[OSB]'>0.5</span> с</p>
                <p className='text-[20px]'>ждет загрузки</p>
              </div>

              <div className="flex flex-col items-center">
                <p className='text-[#828282] text-[20px]'><span className='text-[42px] text-white font-[OSB]'>3</span> действ.</p>
                <p className='text-[20px]'>совершает</p>
              </div>
            </div>
            <p className='text-[24px] font-[OSB] mt-8'>Статистика посещения по дням недели</p>
            <div className="mt-7 flex w-full items-end h-[190px] justify-between">
              <div className="flex flex-col items-center">
                <div className={` w-[67px] rounded-t-[10px]`} style={{ background: "linear-gradient(180deg, rgba(155,207,255,1) 0%, rgba(63,150,231,1) 100%)", height: `${(160 / 100) * (week.mon / (maxValue / 100))}px` }}></div>
                <p className='mt-[10px] font-[OSB] text-[20px]'>пн</p>
              </div>
              <div className="flex flex-col items-center">
                <div className={` w-[67px] rounded-t-[10px]`} style={{ background: "linear-gradient(180deg, rgba(155,207,255,1) 0%, rgba(63,150,231,1) 100%)", height: `${(160 / 100) * (week.tue / (maxValue / 100))}px` }}></div>
                <p className='mt-[10px] font-[OSB] text-[20px]'>вт</p>
              </div>
              <div className="flex flex-col items-center">
                <div className={` w-[67px] rounded-t-[10px]`} style={{ background: "linear-gradient(180deg, rgba(155,207,255,1) 0%, rgba(63,150,231,1) 100%)", height: `${(160 / 100) * (week.wed / (maxValue / 100))}px` }}></div>
                <p className='mt-[10px] font-[OSB] text-[20px]'>ср</p>
              </div>
              <div className="flex flex-col items-center">
                <div className={` w-[67px] rounded-t-[10px]`} style={{ background: "linear-gradient(180deg, rgba(155,207,255,1) 0%, rgba(63,150,231,1) 100%)", height: `${(160 / 100) * (week.thu / (maxValue / 100))}px` }}></div>
                <p className='mt-[10px] font-[OSB] text-[20px]'>чт</p>
              </div>
              <div className="flex flex-col items-center">
                <div className={` w-[67px] rounded-t-[10px]`} style={{ background: "linear-gradient(180deg, rgba(155,207,255,1) 0%, rgba(63,150,231,1) 100%)", height: `${(160 / 100) * (week.fri / (maxValue / 100))}px` }}></div>
                <p className='mt-[10px] font-[OSB] text-[20px]'>пт</p>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-[67px] rounded-t-[10px]`} style={{ background: "linear-gradient(180deg, rgba(155,207,255,1) 0%, rgba(63,150,231,1) 100%)", height: `${(160 / 100) * (week.sat / (maxValue / 100))}px` }}></div>
                <p className='mt-[10px] font-[OSB] text-[20px]'>сб</p>
              </div>
              <div className="flex flex-col items-center">
                <div className={` w-[67px] rounded-t-[10px]`} style={{ background: "linear-gradient(180deg, rgba(155,207,255,1) 0%, rgba(63,150,231,1) 100%)", height: `${(160 / 100) * (week.sun / (maxValue / 100))}px` }}></div>
                <p className='mt-[10px] font-[OSB] text-[20px]'>вс</p>
              </div>
            </div>
            <p className='text-[24px] font-[OSB] mt-5'>Статистика посещения по часам</p>
            <div className='w-full flex justify-center mt-3'>
              <Chart />
            </div>
          </div>
          <div className="flex flex-col items-center w-[32%] gap-7">
            <div className="w-full h-[419px] bg-[#2B2B2B] rounded-[20px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-[240px] h-[240px]">
                  <Pie
                    type="pie"
                    width={130}
                    height={50}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      title: {
                        display: false,
                      },
                    }}
                    data={pieChartData}
                  />
                </div>
                <div className="flex justify-center w-[419px] mt-9">
                  <div className="w-[80%] flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <div className="flex items-start w-[150px] gap-2.5">
                        <div className="w-[20px] h-[18px] bg-[#0035EF]"></div>
                        <p className='text-[12px] w-[150px] ' style={{ whiteSpace: "normal" }}>Пользователи без регистрации</p>
                      </div>
                      <p className='mt-2 text-[22px] font-[OSB] w-[150px] flex items-center justify-center'>{(userNoAuth / ((userAuth + userNoAuth) / 100)).toFixed(2)}%</p>
                    </div>
                    <div className="h-[74px] w-[1px] border-r-[1px] border-[#434343]"></div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-start w-[150px] gap-2.5">
                        <div className="w-[20px] h-[18px] bg-[#9BCFFF]"></div>
                        <p className='text-[12px] w-[150px]' style={{ whiteSpace: "normal" }}>Пользователи с регистрацией</p>
                      </div>
                      <p className='mt-2 text-[22px] font-[OSB] w-[150px] flex items-center justify-center'>{(userAuth / ((userAuth + userNoAuth) / 100)).toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[419px] bg-[#2B2B2B] rounded-[20px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-[240px] h-[240px]">
                  <Pie
                    type="pie"
                    width={130}
                    height={50}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      title: {
                        display: false,
                      },
                    }}
                    data={pieChartData}
                  />
                </div>
                <div className="flex justify-center w-[419px] mt-9">
                  <div className="w-[80%] flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <div className="flex items-start w-[150px] gap-2.5">
                        <div className="w-[20px] h-[18px] bg-[#0035EF]"></div>
                        <p className='text-[12px] w-[150px] ' style={{ whiteSpace: "normal" }}>Доля новых пользователей</p>
                      </div>
                      <p className='mt-2 text-[22px] font-[OSB] w-[150px] flex items-center justify-center'>{(userNoAuth / ((userAuth + userNoAuth) / 100)).toFixed(2)}%</p>
                    </div>
                    <div className="h-[74px] w-[1px] border-r-[1px] border-[#434343]"></div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-start w-[150px] gap-2.5">
                        <div className="w-[20px] h-[18px] bg-[#9BCFFF]"></div>
                        <p className='text-[12px] w-[150px]' style={{ whiteSpace: "normal" }}>Доля вернувшихся пользователей</p>
                      </div>
                      <p className='mt-2 text-[22px] font-[OSB] w-[150px] flex items-center justify-center'>{(userAuth / ((userAuth + userNoAuth) / 100)).toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start justify-between w-full mt-7">
          <div className="w-[66%] h-[866px] bg-[#2B2B2B] rounded-[20px] p-8 flex flex-col items-center">
            <p className='text-[24px] font-[OSB] mt-3'>Топ городов по посещениям</p>
            <div className="w-full mt-14">
              <KazakhstanMap visitorData={visitorData} />
            </div>
            <div className="flex flex-col items-center mt-10">
              <div className="flex items-center gap-14">
                <div className="flex flex-col items-center">
                  <p className='text-[25px] font-[OSB]'>1. Астана</p>
                  <p className='text-[22px]'>5000 человек</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className='text-[25px] font-[OSB]'>1. Астана</p>
                  <p className='text-[22px]'>5000 человек</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className='text-[25px] font-[OSB]'>1. Астана</p>
                  <p className='text-[22px]'>5000 человек</p>
                </div>
              </div>
              <div className="flex items-center gap-14 mt-8">
                <div className="flex flex-col items-center">
                  <p className='text-[25px] font-[OSB]'>1. Астана</p>
                  <p className='text-[22px]'>5000 человек</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className='text-[25px] font-[OSB]'>1. Астана</p>
                  <p className='text-[22px]'>5000 человек</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-[32%] gap-7">
            <div className="w-full h-[419px] bg-[#2B2B2B] rounded-[20px] flex items-center justify-center">

              <div className="flex flex-col items-center">
                <div className="w-full flex justify-center">
                  <HalfPieChart />
                </div>
                <div className="flex justify-center w-[419px] mt-9">
                  <div className="w-[80%] flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <div className="flex items-start w-[150px] gap-2.5">
                        <div className="w-[20px] h-[18px] bg-[#67b7dc]"></div>
                        <p className='text-[12px] w-[150px] ' style={{ whiteSpace: "normal" }}>Посещений по хим. разделу</p>
                      </div>
                      <p className='mt-2 text-[22px] font-[OSB] w-[150px] flex items-center justify-center'>70%</p>
                    </div>
                    <div className="h-[74px] w-[1px] border-r-[1px] border-[#434343]"></div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-start w-[150px] gap-2.5">
                        <div className="w-[20px] h-[18px] bg-[#6894dd]"></div>
                        <p className='text-[12px] w-[150px]' style={{ whiteSpace: "normal" }}>Посещений по орг. разделу</p>
                      </div>
                      <p className='mt-2 text-[22px] font-[OSB] w-[150px] flex items-center justify-center'>30%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>





            <div className="w-full h-[419px] bg-[#2B2B2B] rounded-[20px] p-10">
              <p className='text-[24px] font-[OSB]'>Популярные страницы</p>
              <div className="flex justify-between items-center mt-9">
                <div className="flex flex-col items-start gap-10">

                  {topPages.length >= 6 && (
                    <div className="grid grid-cols-2 gap-10">
                      {topPages.slice(0, 6).map((page, index) => (
                        <div key={page.name} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between w-full">
                            <p>{page.name}</p>
                            <p>{page.views}</p>
                          </div>
                          <div className="w-[150px] h-[10px] bg-gray-200 rounded-full relative">
                            <div
                              className={`absolute left-0 top-0 h-[10px] bg-blue-600 rounded-[4px]`}
                              style={{ width: `${page.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>





              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="w-[66%] h-[574px] bg-[#2B2B2B] rounded-[20px] p-8 flex items-center flex-col">
            <p className='text-[24px] font-[OSB] mt-3 mb-6'>Переходы по рекламе</p>
            <DraggableBarChart />
          </div>
          <div className="w-[32%] h-[574px] bg-[#2B2B2B] rounded-[20px] p-8"></div>
        </div>
      </div>
    </div>
  )
}

export default Statistic