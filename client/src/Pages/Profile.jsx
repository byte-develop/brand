import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthService } from '../services/auth.service';
import UpdateEmail from './UpdateEmail';
import UpdatePhoto from './UpdatePhoto';
import ChangePassword from './ChangePassword';
import ShopItem from './Catalog-Components/ShopItem';
import FavouriteShops from './FavouriteShops';
import { useMediaQuery } from 'react-responsive';
import MobileFavouriteShops from './MobileFavouriteShops';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [photoUrl, setPhotoUrl] = useState('');
  const [favouriteShops, setFavouriteShops] = useState([]);
  const [balance, setBalance] = useState(0);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [disable, setDisable] = useState(true)

  useEffect(() => {
    const fetchFavouriteShops = async () => {
      if (user && user.id) {
        try {
          const response = await AuthService.getFavouriteShops(user.id);
          setFavouriteShops(response);
        } catch (error) {
          console.error('Ошибка при загрузке избранных магазинов:', error);
        }
      }
    };

    fetchFavouriteShops();
  }, [user]);

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
    const fetchPhoto = async () => {
      if (user && user.id) {
        try {
          const photo = await AuthService.getUserPhotoById(user.id);
          setPhotoUrl(photo);
        } catch (error) {
          console.error('Ошибка при получении фото пользователя:', error);
        }
      }
    };

    fetchPhoto();
  }, [user]);

  useEffect(() => {
    const GetBalance = async () => {
      if (user && user.id) {
        try {
          const response = await fetch('/bonus/get_balance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ID: user.id }),
          });

          if (!response.ok) throw new Error('Network response was not ok');

          const data = await response.json();
          setBalance(data.balance);
        } catch (error) {
          console.error('Ошибка при получении баланса:', error);
        }
      }
    };

    GetBalance();
  }, [user]);


  return (
    <>
      {
        isMobile ?
          <div className="w-full h-full relative">
            <div className='flex flex-col mx-[5%] pt-3 pb-60 z-30 relative'>
              <div className="">
                <div className="w-full flex justify-center">
                  <p className='font-[OB] text-[20px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>МОЙ ПРОФИЛЬ</p>
                </div>
                <div style={{ backgroundImage: "url(../ShopDetailBG.png)", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }} className="w-full h-[1px] mt-2"></div>
              </div>
              <div className="flex flex-col">
                <div className="">
                  {user && (
                    <div className='justify-between flex gap-x-[5vw]'>
                      <div className="">
                        <p className='font-[OB] text-[16px] text-transparent mt-3' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>{user.login}</p>
                        {photoUrl ? (
                          <img className='object-cover rounded-xl mt-2 border-white border-[1px] border-opacity-20' src={photoUrl} alt="User Photo" style={{ width: '40vw', height: '40vw' }} />
                        ) : (
                          <img className='object-cover rounded-xl mt-2' src='../public/ProfileDefault.png' style={{ width: '40vw', height: '40vw' }}></img>
                        )}
                        <UpdatePhoto userId={user.id} currentPhoto={user.photo} />
                      </div>
                      <div className="w-[45vw] mt-4">
                        <div className="flex items-center justify-between">
                          <p className='font-[OSB] text-[14px] '>Почта</p>
                          <button type="button" onClick={() => setDisable(!disable)} className='text-end text-[13px] text-[#003AD1]'>изменить почту </button>
                        </div>
                        <UpdateEmail userId={user.id} currentEmail={user.email} disable={disable} />
                        <p className='font-[OSB] text-[14px] mt-5'>Пароль</p>
                        <ChangePassword userId={user.id} />
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ backgroundImage: "url(../ShopDetailBG.png)", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }} className="w-full h-[1px] mt-2"></div>
                <div className="flex items-center justify-between mt-2">
                  <p className='font-[OB] text-[20px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>Счет</p>
                  <div className="flex items-center">
                    <p className='font-[OB] text-[20px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>{balance}</p>
                    <img src="../public/coin.png" alt="" className='h-[30px] ml-2' />
                  </div>
                </div>
                <div style={{ backgroundImage: "url(../ShopDetailBG.png)", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }} className="w-full h-[1px] mt-2"></div>
                <div className="w-full flex flex-col items-center">
                  <h1 className='font-[OB] text-[20px] text-transparent mt-[2vh]' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>Избранное</h1>
                  <div className="flex flex-wrap justify-between gap-x-3">
                    {favouriteShops.length > 0 ? (
                      favouriteShops.map(shop => (
                        <div className="" key={shop.id}>
                          <MobileFavouriteShops
                            userid={user.id}
                            id={shop.id}
                            name={shop.name}
                            slogan={shop.slogan}
                            rating={shop.rating}
                            photo={shop.photo}
                            recommended={shop.recommended}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-full flex justify-center mt-20">
                        <p className='font-[OB] text-[20px] text-transparent mt-3' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>Нет избранных магазинов.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          :
          <div className="h-full w-full relative">
            <div className='flex flex-col mx-[15%] pt-10 pb-80 relative'>
              <div className="">
                <div className="w-full flex justify-between ">
                  <p className='font-[OB] text-[40px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>МОЙ ПРОФИЛЬ</p>
                  <div className="flex items-center">
                    <p className='font-[OB] text-[40px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>{balance}</p>
                    <img src="../public/coin.svg" alt="" className='h-12 ml-2' />
                  </div>
                </div>
                <div style={{ backgroundImage: "url(../ShopDetailBG.png)", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }} className="w-full h-[1px] mt-2"></div>
              </div>
              <div className="flex justify-between ">
                <div className="">
                  {user && (
                    <div>
                      <p className='font-[OB] text-[40px] text-transparent mt-3' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>{user.login}</p>
                      {photoUrl ? (
                        <img className='object-cover rounded-xl mt-2 border-white border-[1px] border-opacity-20' src={photoUrl} alt="User Photo" style={{ width: '300px', height: '300px' }} />
                      ) : (
                        <img className='object-cover rounded-xl mt-2' src='../public/ProfileDefault.png' style={{ width: '300px', height: '300px' }}></img>
                      )}
                      <UpdatePhoto userId={user.id} currentPhoto={user.photo} />
                      <p className='font-[OSB] text-[40px] text-transparent mt-3' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>Ваши данные</p>
                      <p className='font-[OSB] text-[20px] mt-4'>Почта</p>
                      <UpdateEmail userId={user.id} currentEmail={user.email} disable={disable} setDisable={setDisable} />
                      <p className='font-[OSB] text-[20px] mt-6'>Пароль</p>
                      <ChangePassword userId={user.id} />
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <h1 className='font-[OB] text-[40px] text-transparent ml-14' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>Избранное</h1>
                  <div className="flex flex-wrap">
                    {favouriteShops.length > 0 ? (
                      favouriteShops.map(shop => (
                        <div className="w-1/3 p-2" key={shop.id}>
                          <FavouriteShops
                            userid={user.id}
                            id={shop.id}
                            name={shop.name}
                            slogan={shop.slogan}
                            rating={shop.rating}
                            photo={shop.photo}
                            recommended={shop.recommended}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-full flex justify-center mt-20">
                        <p className='font-[OB] text-[20px] text-transparent mt-3' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>Нет избранных магазинов.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
    </>
  );
};

export default Profile;