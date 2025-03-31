import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AuthService } from '../services/auth.service';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import "./rarecase.css"

const EventCase = () => {
  const dispatch = useDispatch();
  const [loadind, setLoadind] = useState(false)
  const [loadind2, setLoadind2] = useState(true)
  const [prize, setPrize] = useState()
  const [open, setOpen] = useState(false)
  const [animationLine, setAnimationLine] = useState()
  const user = useSelector((state) => state.user.user);
  const [finalPrize, setFinalPrize] = useState(null);
  const [succes, setSucces] = useState(false);
  const [event, setEvent] = useState(null);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/api/event/user/${user.id}`);
      setEvent(response.data);
      if (response.data.succes) {
        setSucces(true)
      }
      if (response.data.prize) {
        setPrize(response.data.prize)
      }
    } catch (err) {

    } finally {
      setLoadind2(false);
    }
  };


  useEffect(() => {
    fetchEvent();
  }, [user])


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await AuthService.getMe();
        dispatch({ type: 'user/LoginSlice', payload: response });
      } catch (error) {
        console.error('Ошибка при получении профиля:', error);
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  const [prizes, setPrizes] = useState({
    "2000 tokens": "../public/event/2000.png",
    "2500 tokens": "../public/event/2500.png",
    "3000 tokens": "../public/event/3000.png",
    "3500 tokens": "../public/event/3500.png",
    "4000 tokens": "../public/event/4000.png",
    "4500 tokens": "../public/event/4500.png",
    "5000 tokens": "../public/event/5000.png",
    "50$": "../public/event/50$.png",
    "Bingo": "../public/event/bingo.png",
    "1G Garage": "../public/event/1G_garage.png",
    "1G Lee": "../public/event/1G_Lee.png",
    "1G Skitty": "../public/event/1G_Skitty.png",
  })

  const GetPrize1 = async () => {
    if (user && user.id) {
      setLoadind(true);
      try {
        const response = await fetch('/bonus/get_bonus/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ID: user.id }),
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        let images = new Array(70).fill(null);
        images[64] = prizes[`${data.BONUS}`];
        console.log(prizes)
        const otherPrizes = Object.values(prizes);

        for (let i = 0; i < images.length; i++) {
          if (images[i] === null) {
            const randomIndex = Math.floor(Math.random() * otherPrizes.length);
            images[i] = otherPrizes[randomIndex];
          }
        }

        setOpen(true);
        setAnimationLine(images);
        setFinalPrize(prizes[`${data.BONUS}`]);
        fetchEvent()

        const handleAnimationEnd = () => {
          setTimeout(() => {
            setOpen(false);
            setLoadind(false);
          }, 1000);
          document.removeEventListener('animationend', handleAnimationEnd);
        };

        document.addEventListener('animationend', handleAnimationEnd);
      } catch (err) {
        toast.error("Ошибка");
        setLoadind(false);
      }
    }
  };

  const [Prizes, setprizes] = useState()

  useEffect(() => {
    const GetPrizes = async () => {
      try {
        const response = await fetch('/api/event/prizes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        console.log(data)

        const updatedPrizes = { ...prizes };

        const conditions = [
          { prize: "1G Garage", count: data.filter(prize => prize === '1G Garage').length, threshold: 3 },
          { prize: "50$", count: data.filter(prize => prize === '50$').length, threshold: 5 },
          { prize: "1G Skitty", count: data.filter(prize => prize === '1G Skitty').length, threshold: 3 },
          { prize: "1G Lee", count: data.filter(prize => prize === '1G Lee').length, threshold: 3 },
          { prize: "20% Da Vinci", count: data.filter(prize => prize === '20% Da Vinci').length, threshold: 2 },
          { prize: "10% Borderline", count: data.filter(prize => prize === '10% Borderline').length, threshold: 2 },
          { prize: "Bingo", count: data.filter(prize => prize === 'Bingo').length, threshold: 3 },
        ];

        conditions.forEach(({ prize, count, threshold }) => {
          if (count >= threshold) {
            delete updatedPrizes[prize];
          }
        });

        setPrizes(updatedPrizes);
        console.log(updatedPrizes)

      } catch (err) {
        console.error(err);
      }
    }

    GetPrizes();
  }, []);

  const isAuth = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      setShowModal(true);
    }
  }, [isAuth]);

  const closeModal = () => {
    setShowModal(false);
  };

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <>
      {
        isMobile ?

          <div className='flex flex-col items-center bg-[#0E0822] justify-center pb-40 relative'>
            {showModal && <LoginModal onClose={closeModal} />}
            <p className='font-[PR] text-[48px] mt-16'>НОВОГОДНИЙ</p>
            <img src="../public/event/ebm.png" alt="" className='absolute bottom-0 w-full z-0' />
            <img src="../public/event/CaseStars.png" alt="" className='absolute top-[5%] w-full z-0' />

            {
              open ?
                <div className="flex items-center justify-center w-[370px] h-[163px] border border-white rounded-2xl overflow-hidden relative mt-10 z-10">
                  <img src="../public/event/arrow.png" className='absolute right-[50%] top-0 translate-x-[50%] z-20' alt="" />
                  <div className="flex items-center gap-2 animation2">
                    {
                      animationLine.map((src, index) => (
                        <img key={index} src={src} className="h-[130px]" alt='' />
                      ))
                    }
                  </div>
                </div>
                :
                <div className="relative w-full flex flex-col items-center justify-center">
                  <img src="../public/event/EventRm.png" className='absolute right-0 w-[30%]' alt="" />
                  <img src="../public/event/EventLm.png" className='absolute left-0 w-[30%]' alt="" />

                  {finalPrize ? (
                    <div className='z-10 relative flex flex-col items-center'>
                      <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 100px 90px rgba(118, 0, 144, 0.7)" }}></div>
                      <img src={finalPrize} className="h-[140px] mt-20 transform transition-transform duration-300 ease-in-out z-10" alt="" />
                      {finalPrize == "../public/event/2000.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}
                      {finalPrize == "../public/event/2500.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}
                      {finalPrize == "../public/event/3000.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}
                      {finalPrize == "../public/event/3500.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}
                      {finalPrize == "../public/event/4000.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}
                      {finalPrize == "../public/event/4500.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}
                      {finalPrize == "../public/event/5000.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[60px]'></img>}

                      {finalPrize == "../public/event/50$.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[60px]'></img>}
                      {finalPrize == "../public/event/bingo.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[60px]'></img>}
                      {finalPrize == "../public/event/10_Borderline.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[60px]'></img>}
                      {finalPrize == "../public/event/20_Vinci.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[60px]'></img>}

                      {finalPrize == "../public/event/1G_garage.png" && <img src="../public/ex.png" className='z-50 relative mt-4 h-[60px]'></img>}
                      {finalPrize == "../public/event/1G_Lee.png" && <img src="../public/ex.png" className='z-50 relative mt-4 h-[60px]'></img>}
                      {finalPrize == "../public/event/1G_Skitty.png" && <img src="../public/ex.png" className='z-50 relative mt-4 h-[60px]'></img>}

                      <button onClick={() => setFinalPrize(false)} className='w-[200px] h-[60px] rounded-3xl mt-8 font-[OB] text-[20px] z-50' style={{ background: "linear-gradient(90deg, rgba(84, 11, 126, 1) 0%, rgba(139, 21, 207 ,1) 25%, rgba(84, 11, 126, 1) 75%, rgba(84, 11, 126,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(84, 11, 126) inset, 0px -2px 28px 2px rgba(84, 11, 126)' }}>Получить</button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 100px 90px rgba(118, 0, 144, 0.7)" }}></div>
                      <img src="../public/event/EventCase.png" className="h-[175px] mt-12 transform transition-transform duration-300 ease-in-out z-10" alt="" />
                    </div>
                  )}
                </div>
            }

            {!finalPrize ?


              <button onClick={GetPrize1} disabled={loadind || !succes || prize} className='relative z-10 w-[200px] h-[50px] rounded-2xl mt-16 font-[OB] text-[16px]' style={{ background: "linear-gradient(90deg, rgba(84, 11, 126, 1) 0%, rgba(139, 21, 207 ,1) 25%, rgba(84, 11, 126, 1) 75%, rgba(84, 11, 126,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(84, 11, 126) inset, 0px -2px 28px 2px rgba(84, 11, 126)' }}>
                {
                  loadind ?

                    <div className='flex items-center justify-center'>
                      <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                      </svg>
                      ОТКРЫТИЕ...
                    </div>

                    :

                    <>
                      {loadind2 ?

                        <div className='flex items-center justify-center'>
                          <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                            <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                          </svg>
                          Загрузка...
                        </div>

                        :

                        <>
                          {prize ?

                            <div className="flex items-center justify-center">
                              <p>Получено</p>
                            </div>

                            :

                            <>
                              {
                                succes ?

                                  <div className="flex items-center justify-center">
                                    <p>ОТКРЫТЬ</p>
                                  </div>

                                  :

                                  <div className="flex items-center justify-center font-[OSB]">
                                    <p>Недоступен</p>
                                  </div>
                              }
                            </>
                          }
                        </>

                      }
                    </>
                }
              </button>

              :

              <></>


            }

            <p className='text-[24px] mt-28 font-[LZ] text-center w-[70%]' style={{ whiteSpace: "normal" }}>СОДЕРЖИМОЕ КЕЙСА</p>

            <div className='mt-8'>
              <div className="flex justify-center flex-wrap">
                <img className='w-[40%]' src="../public/event/2000.png" />
                <img className='w-[40%] ml-8' src="../public/event/2500.png" />
                <img className='w-[40%] mt-8' src="../public/event/3000.png" />
                <img className='w-[40%] ml-8 mt-8' src="../public/event/3500.png" />

                <img className='w-[40%] mt-8' src="../public/event/4000.png" alt="360 coins" />
                <img className='w-[40%] ml-8 mt-8' src="../public/event/4500.png" alt="300 coins" />
                <img className='w-[40%] mt-8' src="../public/event/5000.png" alt="240 coins" />

                <img className='w-[40%] ml-8 mt-8' src="../public/event/50$.png" alt="180 coins" />
                <img className='w-[40%] mt-8' src="../public/event/bingo.png" alt="120 coins" />
                <img className='w-[40%] ml-8 mt-8' src="../public/event/10_Borderline.png" alt="96 coins" />
                <img className='w-[40%] mt-8' src="../public/event/20_Vinci.png" alt="60 coins" />  

                <img className='w-[40%] ml-8 mt-8' src="../public/event/1G_garage.png" alt="360 coins" />
                <img className='w-[40%] mt-8' src="../public/event/1G_Lee.png" alt="300 coins" />
                <img className='w-[40%] ml-8 mt-8' src="../public/event/1G_Skitty.png" alt="240 coins" />
              </div>
            </div>
          </div >

          :

          <div className='flex flex-col items-center justify-center pb-[600px] bg-[#0E0822] relative overflow-hidden'>
            {showModal && <LoginModal onClose={closeModal} />}
            <p className='font-[PR] text-[64px] mt-32'>НОВОГОДНИЙ</p>
            <img src="../public/event/CaseStars1.png" alt="" className='absolute top-0 w-full z-0' />
            <img src="../public/event/CaseStars2.png" alt="" className='absolute top-[50%] w-full z-0' />
            <img src="../public/event/EB.png" alt="" className='absolute bottom-0 w-full z-0' />

            {
              open ?
                <div className="flex items-center justify-center w-[1350px] bg-[#390047] bg-opacity-60 h-[300px] border border-white rounded-2xl overflow-hidden relative mt-10 z-10">
                  <img src="../public/event/arrow.png" className='absolute right-[50%] top-0 translate-x-[50%] z-20' alt="" />
                  <div className="flex items-center gap-4 animation">
                    {
                      animationLine.map((src, index) => (
                        <img key={index} src={src} className="h-[240px]" alt='' />
                      ))
                    }
                  </div>
                </div>
                :
                <div className="relative w-full flex flex-col items-center justify-center z-10">
                  <img src="../public/event/EventR.png" className='absolute right-0 w-[30%]' alt="" />
                  <img src="../public/event/EventL.png" className='absolute left-0 w-[30%]' alt="" />

                  {finalPrize ? (
                    <div className='z-10 relative flex flex-col items-center'>
                      <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 150px 140px rgba(118, 0, 144, 0.7)" }}></div>
                      <img src={finalPrize} className="h-[301px] mt-20 transform transition-transform duration-300 ease-in-out z-10" alt="" />
                      {finalPrize == "../public/event/2000.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[100px]'></img>}
                      {finalPrize == "../public/event/2500.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[100px]'></img>}
                      {finalPrize == "../public/event/3000.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[100px]'></img>}
                      {finalPrize == "../public/event/3500.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[100px]'></img>}
                      {finalPrize == "../public/event/4000.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[100px]'></img>}
                      {finalPrize == "../public/event/4500.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[100px]'></img>}
                      {finalPrize == "../public/event/5000.png" && <img src="../public/stand.png" className='z-50 relative mt-4 h-[100px]'></img>}

                      {finalPrize == "../public/event/50$.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[100px]'></img>}
                      {finalPrize == "../public/event/bingo.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[100px]'></img>}
                      {finalPrize == "../public/event/10_Borderline.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[100px]'></img>}
                      {finalPrize == "../public/event/20_Vinci.png" && <img src="../public/red.png" className='z-50 relative mt-4 h-[100px]'></img>}

                      {finalPrize == "../public/event/1G_garage.png" && <img src="../public/ex.png" className='z-50 relative mt-4 h-[100px]'></img>}
                      {finalPrize == "../public/event/1G_Lee.png" && <img src="../public/ex.png" className='z-50 relative mt-4 h-[100px]'></img>}
                      {finalPrize == "../public/event/1G_Skitty.png" && <img src="../public/ex.png" className='z-50 relative mt-4 h-[100px]'></img>}

                      <button onClick={() => setFinalPrize(false)} className='w-[300px] h-[60px]  rounded-3xl mt-8 font-[OB] text-[20px]' style={{ background: "linear-gradient(90deg, rgba(84, 11, 126, 1) 0%, rgba(139, 21, 207 ,1) 25%, rgba(84, 11, 126, 1) 75%, rgba(84, 11, 126,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(84, 11, 126) inset, 0px -2px 28px 2px rgba(84, 11, 126)' }}>Получить</button>
                    </div>
                  ) : (
                    <div className="relative z-10">
                      <div className="bg-[#0028B8] bg-opacity-50 rounded-full absolute left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2" style={{ boxShadow: "0px 0px 150px 140px rgba(118, 0, 144, 0.7)" }}></div>
                      <img src="../public/event/EventCase.png" className="h-[301px] mt-20 transform transition-transform duration-300 ease-in-out z-10" alt="" />
                    </div>
                  )}
                </div>
            }

            {!finalPrize ?


              <button onClick={GetPrize1} disabled={loadind || !succes || prize} className='relative z-10 w-[200px] h-[50px] rounded-2xl mt-16 font-[OB] text-[16px]' style={{ background: "linear-gradient(90deg, rgba(84, 11, 126, 1) 0%, rgba(139, 21, 207 ,1) 25%, rgba(84, 11, 126, 1) 75%, rgba(84, 11, 126,1) 100%)", boxShadow: '0px -4px 8px 0px rgba(84, 11, 126) inset, 0px -2px 28px 2px rgba(84, 11, 126)' }}>
                {
                  loadind ?

                    <div className='flex items-center justify-center'>
                      <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                      </svg>
                      ОТКРЫТИЕ...
                    </div>

                    :

                    <>
                      {loadind2 ?

                        <div className='flex items-center justify-center'>
                          <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                            <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                          </svg>
                          Загрузка...
                        </div>

                        :

                        <>
                          {prize ?

                            <div className="flex items-center justify-center">
                              <p>Получено</p>
                            </div>

                            :

                            <>
                              {
                                succes ?

                                  <div className="flex items-center justify-center">
                                    <p>ОТКРЫТЬ</p>
                                  </div>

                                  :

                                  <div className="flex items-center justify-center font-[OSB]">
                                    <p>Недоступен</p>
                                  </div>
                              }
                            </>
                          }
                        </>

                      }
                    </>
                }
              </button>

              :

              <></>


            }

            <p className='text-[56px] mt-28 font-[LZ]'>СОДЕРЖИМОЕ КЕЙСА</p>

            <div className='mt-24'>
              <div className="flex justify-center">
                <img className='h-[250px] w-[250px]' src="../public/event/2000.png" />
                <img className='h-[250px] w-[250px] ml-20' src="../public/event/2500.png" />
                <img className='h-[270px] w-[270px] mr-11 ml-16' src="../public/event/3000.png" />
                <img className='h-[270px] w-[270px]' src="../public/event/3500.png" />
              </div>

              <div className="flex justify-center mt-20">
                <img className='h-[250px] w-[250px] ' src="../public/event/4000.png" alt="360 coins" />
                <img className='h-[250px] w-[250px] ml-20' src="../public/event/4500.png" alt="300 coins" />
                <img className='h-[250px] w-[250px] ml-20' src="../public/event/5000.png" alt="240 coins" />
              </div>

              <div className="flex justify-center mt-20">
                <img className='h-[250px] w-[250px]' src="../public/event/50$.png" alt="180 coins" />
                <img className='h-[250px] w-[250px] ml-20' src="../public/event/bingo.png" alt="120 coins" />
                <img className='h-[250px] w-[250px] ml-20' src="../public/event/10_Borderline.png" alt="96 coins" />
                <img className='h-[250px] w-[250px] ml-20' src="../public/event/20_Vinci.png" alt="60 coins" />
              </div>

              <div className="flex justify-center mt-20">
                <img className='h-[250px] w-[250px] ' src="../public/event/1G_garage.png" alt="360 coins" />
                <img className='h-[250px] w-[250px] ml-20' src="../public/event/1G_Lee.png" alt="300 coins" />
                <img className='h-[250px] w-[250px] ml-20' src="../public/event/1G_Skitty.png" alt="240 coins" />
              </div>
            </div>
          </div >
      }
    </>
  )
}

export default EventCase