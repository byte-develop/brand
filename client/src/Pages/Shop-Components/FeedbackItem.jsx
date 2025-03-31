import React, { useEffect, useState } from 'react';
import { IoStar } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { AuthService } from '../../services/auth.service';

const FeedbackItem = ({ userId, login, quantity, date, text }) => {

    const [photoUrl, setPhotoUrl] = useState('');

    useEffect(() => {
        const fetchPhoto = async () => {
          try {
            const photo = await AuthService.getUserPhotoById(userId);
            setPhotoUrl(photo);
          } catch (error) {
            console.error('Ошибка при получении фотографии:', error);
          }
        };
    
        fetchPhoto();
      },);

    return (
        <div className='flex text-black relative mb-5'>
            <img
                src={photoUrl ? photoUrl : "../public/avatar.png"}
                alt=""
                className="h-[66px] w-[66px] rounded-full object-cover"
            />
            <div className="ml-6 mb-7 flex flex-col w-full">
                <div className="flex items-center relative w-90%">
                    <div className="flex items-center">
                        <p className='font-[OSB] text-[18px]'>{login}</p>
                        <p className='ml-[5px] text-[#848484]'>{date}</p>
                    </div>
                </div>
                <div className="absolute right-0 flex"><IoStar size={20} color='#003AD1' opacity={quantity <= 4 ? .3 : 1} /><IoStar size={20} color='#003AD1' opacity={quantity <= 3 ? .3 : 1} /><IoStar size={20} color='#003AD1' opacity={quantity <= 2 ? .3 : 1} /><IoStar size={20} color='#003AD1' opacity={quantity <= 1 ? .3 : 1} /><IoStar size={20} color='#003AD1' opacity={quantity == 0 ? .3 : 1} /></div>
                <p className='w-[85%]' style={{ whiteSpace: "normal", overflowWrap: "break-word" }}>
                    {text}
                </p>
            </div>
            <div className="absolute bottom-0 h-[2px] w-full" style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}></div>
        </div>
    );
}

export default FeedbackItem;