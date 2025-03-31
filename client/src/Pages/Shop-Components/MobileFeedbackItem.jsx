import React, { useEffect, useState } from 'react'
import { AuthService } from '../../services/auth.service';
import { IoStar } from 'react-icons/io5';

const MobileFeedbackItem = ({ userId, login, quantity, date, text }) => {

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
        <div className='bg-white w-[90%] min-h-[130px] mb-5 rounded-2xl text-black'>
            <div className="flex justify-between px-4 pt-4">
                <div className="flex-col flex ">
                    <img src={photoUrl ? photoUrl : "../public/avatar.png"} alt="" className='h-[48px] w-[48px] rounded-full' />
                    <p className='font-[OB] mt-1'>{login}</p>
                </div>
                <div className="">
                    <div className="flex"><IoStar size={20} color='#003AD1' opacity={quantity <= 4 ? .3 : 1} /><IoStar size={20} color='#003AD1' opacity={quantity <= 3 ? .3 : 1} /><IoStar size={20} color='#003AD1' opacity={quantity <= 2 ? .3 : 1} /><IoStar size={20} color='#003AD1' opacity={quantity <= 1 ? .3 : 1} /><IoStar size={20} color='#003AD1' opacity={quantity == 0 ? .3 : 1} /></div>
                    <p className='ml-[5px] text-right text-[12px] text-[#848484]'>{date}</p>
                </div>
            </div>
            <div className='p-4' style={{ whiteSpace: "normal", overflowWrap: "break-word" }}>
                <p >{text}</p>
            </div>
        </div>
    )
}

export default MobileFeedbackItem