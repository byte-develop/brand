import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { IoStar } from "react-icons/io5";
import { color } from 'three/examples/jsm/nodes/Nodes.js';
import FeedbackItem from './Shop-Components/FeedbackItem';
import Modal from './Modal'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { AuthService } from '../services/auth.service';
import { instance } from '../api/axios.api';
import { format } from 'date-fns';
import { useMediaQuery } from 'react-responsive';
import MobileFeedbackItem from './Shop-Components/MobileFeedbackItem';

const ShopDetail = () => {
  const [filters, setFilters] = useState({ category: '', city: '', searchTerm: '' });
  const isAuth = useAuth();
  const { id } = useParams();
  const [shop, setShops] = useState([]);
  const [isActive, setIsActive] = useState("all")
  const [feedback, setFeedback] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [averageQuantity, setAverageQuantity] = useState()
  const itemsPerPage = 3;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isDesc = useMediaQuery({ query: '(max-width: 1580px)' });
  const [buttons, setButtons] = useState();

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

  useEffect(() => {
    if (feedback.length > 0) {
      const totalQuantity = feedback.reduce((sum, item) => sum + item.quantity, 0);
      const quantity = (totalQuantity / feedback.length).toFixed(2);
      setAverageQuantity(quantity);
    } else {
      setAverageQuantity(0);
    }
  }, [feedback]);

  const filteredFeedback = feedback.filter(feedback => {
    if (isActive === 'positives') {
      return feedback.quantity >= 3;
    }
    if (isActive === 'negatives') {
      return feedback.quantity < 3;
    }
    return true;
  });

  const indexOfLastFeedback = currentPage * itemsPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - itemsPerPage;
  const currentFeedback = filteredFeedback.slice(indexOfFirstFeedback, indexOfLastFeedback);

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);

  const fetchShops = async () => {
    try {
      const response = await axios.get(`/api/shops/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shops:', error);
      throw error;
    }
  };

  useEffect(() => {
    const getShops = async () => {
      try {
        const data = await fetchShops();
        setShops(data);
      } catch (error) {
        setError('Ошибка при загрузке магазинов');
      } finally {
      }
    };

    getShops();
  }, []);

  useEffect(() => {
    const id_shop = id;
    const fetchShops = async () => {
      try {
        const response = await axios.get('/api/feedback', {
          params: { id_shop }
        });
        const data = await response.data;

        const filteredFeedback = data.filter(feedback => !feedback.hide);
        setFeedback(filteredFeedback);
        console.log(filteredFeedback);
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
      }
    };
    fetchShops();
  }, [id]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (!isAuth) {
      toast.error('Пожалуйста, войдите в систему, чтобы прокомментировать');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  async function addShopToFavourite(userId, shopId) {
    await instance.post('user/favourite/add', { userId, shopId });
  }

  const handleAddToFavourite = async () => {
    if (!user) {
      toast.error('Пожалуйста, войдите в систему, чтобы добавить в избранное');
      return;
    }
    try {
      await addShopToFavourite(user.id, id);
      toast.success('Магазин добавлен в избранное!');
    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
      toast.error('Не удалось добавить магазин в избранное');
    }
  };

  useEffect(() => {
    setButtons(shop.buttons)
  }, [shop])








  if (!buttons) {

  }

  const buttonPattern = /([^-\|]+)\s*-\s*(https?:\/\/[^\s]+|[^\s]+)/g;

  const parseButtons = (text) => {
    const buttons = [];
    let match;

    while ((match = buttonPattern.exec(text)) !== null) {
      const link = match[2].startsWith('http') ? match[2] : `http://${match[2]}`;
      buttons.push({ label: match[1].trim(), link });
    }
    return buttons;
  };

  const buttonData = parseButtons(buttons);
  const buttonCount = buttonData.length;
  const feedbackMarginTop = buttonCount > 0 ? `${buttonCount * 18}px` : '0px';


  const [isaActive, setIsaActive] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    setIsActive(value);
    setIsOpen(false);
    if (value === "positives" || value === "negatives") {
      setCurrentPage(1);
    }
  };

  const removeSpecialCharacters = (text) => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1F000}-\u{1FFFF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{2B50}|\u{FE0F}|\u{1F191}-\u{1F251}|\u{fe00}-\u{fe0f}|\u{31c0}-\u{31ef}|\u{1D300}-\u{1D3FF}]/gu;
    const specialCharacterRegex = /[〽️]/gu;

    return text.replace(emojiRegex, '').replace(specialCharacterRegex, '').trim();
  };

  const cityMap = {
    sem: "Семей",
    acs: "Аксай",
    shu: "Щучинск",
    bor: "Боровое",
    uct: "Усть-Каменогорск",
    eke: "Экибастуз",
    tur: "Туркестан",
    tal: "Талдыкорган",
    tar: "Тараз",
    akt: "Актау",
    ati: "Атырау",
    act: "Актобе",
    kok: "Кокшетау",
    pav: "Павлодар",
    kar: "Караганда",
    shi: "Шымкент",
    kos: "Костанай",
    ura: "Уральск",
    ast: "Астана",
    alm: "Алматы",
    kap: "Капчагай",
    pet: "Петропавловск"
  };

  return (
    <>
      {isMobile ?
        <div className='flex flex-col items-center relative'>
          <div className='w-full flex flex-col items-center z-20 relative'>
            <p className='font-[OB] text-[30px] text-transparent w-[70%] text-center' style={{ whiteSpace: "normal", overflowWrap: "break-word", backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>{shop.name ? removeSpecialCharacters(shop.name) : "Загрузка"}</p>
            <div className="flex justify-between w-full px-[10%] mt-[2vh]">
              <div className="flex flex-col">
                <p
                  className='font-[OB] text-[11px] text-transparent'
                  style={{
                    backgroundImage: "url(../ShopDetailBG.png)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    fontSize: '3.8vw',
                  }}
                >
                  {shop.recommended ? "BRAND RECOMMENDED" : ""}
                </p>
                <div className="bg-white relative w-[45vw] h-[30vh] min-h-[250px] max-h-[300px] flex flex-col items-center rounded-xl">
                  {shop.recommended && <img src="../public/event/bant2.png" className='absolute top-0 left-0 w-[94px]' alt="" />}
                  <img src={shop.photo ? shop.photo : 'https://ibb.org.ru/images/2024/11/14/brandcfed8cbf93f3f725.jpg'} alt="" className='w-[90%] object-cover rounded-lg h-[70%] mt-[8%]' />
                  <div className="w-[90%] mt-[4%] text-black text-[16px] font-[OR]">
                    <p className='font-[OSB] text-[14px]'>Надежность: {shop.rating}%</p>
                    <p className='mb-[4px] font-[OSB] text-[14px]'>{shop.date ? `На сайте с ${shop.date} г` : ""}</p>
                  </div>
                </div>
                <div className="">
                  <button onClick={handleAddToFavourite} className='w-full mt-2 h-[40px] rounded-xl' style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}>В избранное</button>
                </div>
              </div>
              <div className="relative pl-[4vw]">
                <p><span className='font-[OSB]'>Товар:</span> {shop.city && shop.city.slice(3, 6) === "org" ? "Органика" : "Химия"}</p>
                <p className='mt-[5px]' style={{ whiteSpace: "normal" }}><span className='font-[OSB]'>Город:</span> {shop.city && cityMap[shop.city.slice(0, 3)] ? cityMap[shop.city.slice(0, 3)] : "Неизвестный город"}</p>
                <p className='mt-[10px]' style={{ whiteSpace: "normal" }}>{shop.info}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center  z-20 relative">
            <p className='font-[OSB] text-[20px] mt-10'>Актуальные ссылки</p>
          </div>
          <div className="grid-cols-2 grid gap-y-4 gap-x-8 mt-6">
            {buttonData.map((button, index) => (
              <div key={index} className="w-1/2">
                <button
                  className="w-[160px] h-[40px] rounded-xl"
                  style={{
                    background:
                      'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)',
                  }}
                >
                  <a href={button.link} target="_blank" rel="noopener noreferrer" className="w-full h-full text-center flex items-center justify-center">
                    {button.label}
                  </a>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-between w-[80%] z-20 relative">
            <div className="">
              <p className='font-[OB] text-[20px]'>Отзывы</p>
              <div className="flex items-center text-[20px] gap-2"><IoStar size={26} color='#003AD1' />{averageQuantity}</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative text-black">
                <button className="flex items-center rounded-full h-10 w-10" onClick={() => setIsOpen(!isOpen)}>
                  <img className='' src="../public/menufeedback.svg" alt="" />
                </button>
                {isOpen && (
                  <div className="absolute mt-2 bg-[#D9D9D9] bg-opacity-70 rounded w-[162px] text-[#0035EF]">
                    <div onClick={() => handleSelect('all')} className={`p-2 cursor-pointer ${isActive === 'all' ? 'font-bold' : ''}`}>
                      Все
                    </div>
                    <div onClick={() => handleSelect('positives')} className={`p-2 cursor-pointer ${isActive === 'positives' ? 'font-bold' : ''}`}>
                      Положительные
                    </div>
                    <div onClick={() => handleSelect('negatives')} className={`p-2 cursor-pointer ${isActive === 'negatives' ? 'font-bold' : ''}`}>
                      Отрицательные
                    </div>
                  </div>
                )}
              </div>

              <div className="text-white text-[14px]">
                <button
                  className='h-[50px] w-[144px] rounded-full'
                  style={{
                    background:
                      'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)',
                  }}
                  onClick={handleOpenModal}
                >
                  Написать отзыв
                </button>
                {isModalOpen && <Modal onClose={handleCloseModal} id={id} />}
              </div>
            </div>
          </div>

          <div className="w-full mt-9 items-center flex flex-col  z-20 relative">
            {
              feedback.length === 0 ? (
                <div className="flex items-center justify-center h-72 w-full">
                  <p className='text-white font-[OB] text-xl'>Ничего не найдено</p>
                </div>
              ) : (
                filteredFeedback.map(feedback => (
                  <MobileFeedbackItem
                    key={feedback.id}
                    userId={feedback.UserId}
                    login={feedback.login}
                    quantity={feedback.quantity}
                    date={format(new Date(feedback.date), 'dd.MM.yyyy')}
                    text={feedback.text}
                  />
                ))
              )
            }
          </div>
        </div>
        :
        <div className='relative flex flex-col items-center pb-40 overflow-hidden '>
          <div className="relative flex justify-between w-1/2 h-[430px]  z-20 ">
            <div className="mt-16 relative">
              <p className='font-[OB] text-[40px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>{shop.name ? removeSpecialCharacters(shop.name) : "Загрузка"}</p>
              <div className="mt-6">
                <p><span className='font-[OSB]'>Товар:</span> {shop.city && shop.city.slice(3, 6) === "org" ? "Органика" : "Химия"}</p>
                <p className='mt-[5px]'><span className='font-[OSB]'>Город:</span> {shop.city && cityMap[shop.city.slice(0, 3)] ? cityMap[shop.city.slice(0, 3)] : "Неизвестный город"}</p>
                <p className='mt-[5px]' style={{ whiteSpace: "normal" }}>{shop.info}</p>
              </div>


              <div className="flex flex-wrap justify-between mt-[70px]">
                {buttonData.map((button, index) => (
                  <div key={index} className="w-1/3 p-2">
                    <button
                      className="min-w-[167px] h-[40px] rounded-xl"
                      style={{
                        background:
                          'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)',
                      }}
                    >
                      <a href={button.link} target="_blank" rel="noopener noreferrer" className="w-full h-full text-center flex items-center justify-center">
                        {button.label}
                      </a>
                    </button>
                  </div>
                ))}
              </div>

            </div>
            <div className="mt-10 relative">
              <p className='font-[OB] text-[24px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>{shop.recommended == true ? "BRAND RECOMMENDED" : ""}</p>
              <div className="bg-[url('../public/ShopDetailBG.png')] w-[280px] h-[300px] flex flex-col items-center rounded-xl relative">
                {shop.recommended && <img src="../public/event/bant2.png" className='absolute top-0 left-0' alt="" />}
                <img src={shop.photo ? shop.photo : 'https://ibb.org.ru/images/2024/11/14/brandcfed8cbf93f3f725.jpg'} alt="" className='w-[90%] object-cover rounded-lg h-[197px] mt-[8%]' />
                <div className="w-[90%] mt-[3%] text-black text-[16px] font-[OR]">
                  <p className='font-[OSB]'>Надежность: {shop.rating}%</p>
                  <p className='mb-[4px] font-[OSB] text-[14px]'>{shop.date ? `На сайте с ${shop.date} г` : ""}</p>
                </div>
              </div>
              <div className="absolute bottom-0">
                <button onClick={handleAddToFavourite} className='w-[280px] h-[40px] rounded-xl' style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}>добавить в избранное</button>
              </div>
            </div>
          </div>
          <div className="min-h-[500px]  z-20  max-h-[800px] w-1/2 bg-white  rounded-xl mb-[5vh] flex flex-col items-center relative" style={{ marginTop: feedbackMarginTop }}>
            <div className="w-[90%]">
              <div className="text-black flex justify-between mt-[3%]">
                <p className='font-[OB] text-[18px]'>Отзывы</p>
                <button
                  className='font-[OSB] text-[18px] text-[#0028B8]'
                  onClick={handleOpenModal}
                >
                  Оставить отзыв
                </button>
              </div>
              {isModalOpen && <Modal onClose={handleCloseModal} id={id} />}
            </div>
            <div className="w-full h-14 bg-[url(../silver.png)] bg-cover mt-3 flex justify-center">
              <div className="w-[90%] h-full flex items-center text-black">
                <div className="flex items-center text-[20px] gap-2"><IoStar size={26} color='#003AD1' />{averageQuantity}</div>
                <div className={isActive == "all" ? "text-[20px] ml-16 font-[OB] h-full relative flex items-center" : "text-[20px] ml-16 h-full relative flex items-center"}>
                  <button onClick={() => setIsActive("all")}>Все</button>
                  {isActive == "all" ?

                    <div className="absolute h-[4px] rounded-full translate-y-[50%] bottom-0 w-full" style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}></div>

                    : ""}              </div>
                <div className={isActive == "positives" ? "text-[20px] ml-12 font-[OB] h-full relative flex items-center" : "text-[20px] ml-12 h-full relative flex items-center"}>
                  <button onClick={() => (setIsActive("positives"), setCurrentPage(1))}>Положительные</button>
                  {isActive == "positives" ?

                    <div className="absolute h-[4px] rounded-full translate-y-[50%] bottom-0 w-full" style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}></div>

                    : ""}            </div>
                <div className={isActive == "negatives" ? "text-[20px] ml-12 font-[OB] h-full relative flex items-center" : "text-[20px] ml-12 h-full relative flex items-center"}>
                  <button onClick={() => (setIsActive("negatives"), setCurrentPage(1))}>Отрицательные</button>
                  {isActive == "negatives" ?

                    <div className="absolute h-[4px] rounded-full translate-y-[50%] bottom-0 w-full" style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}></div>

                    : ""}
                </div>
              </div>
            </div>
            <div className="w-[90%] mt-9">
              {
                feedback.length === 0 ? (
                  <div className="flex items-center justify-center h-72 w-full">
                    <p className='text-black font-[OB] text-xl'>Ничего не найдено</p>
                  </div>
                ) : (
                  currentFeedback.map(feedback => (
                    <FeedbackItem
                      key={feedback.id}
                      userId={feedback.UserId}
                      login={feedback.login}
                      quantity={feedback.quantity}
                      date={format(new Date(feedback.date), 'dd.MM.yyyy')} // Форматируем дату для отображения
                      text={feedback.text}
                    />
                  ))
                )
              }
              {
                feedback.length === 0 ? "" : (
                  <div className="flex justify-between mt-5 mb-5">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`${currentPage === 1 ? 'cursor-not-allowed grayscale opacity-50 -rotate-180' : 'cursor-pointer -rotate-180'}`}
                    >
                      <img src="../public/next.png" alt="" />
                    </button>
                    <div className="flex justify-center mt-5">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageClick(index + 1)}
                          className={`w-3 h-3 mx-1 rounded-full ${currentPage === index + 1 ? 'bg-[#003AD1]' : 'opacity-30 bg-[#003AD1]'}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`${currentPage === totalPages ? 'cursor-not-allowed grayscale opacity-50' : 'cursor-pointer'}`}
                    >
                      <img src="../public/next.png" alt="" />
                    </button>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default ShopDetail