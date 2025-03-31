import React from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { instance } from '../api/axios.api';

const MobileFavouriteShops = ({ userid, name, slogan, rating, photo, id, recommended }) => {
    const navigate = useNavigate()



    async function deleleShopToFavourite(userId, shopId) {
        await instance.post('user/favourite/remove', { userId, shopId });
    }

    const handleDeleteToFavourite = async () => {
        try {
            await deleleShopToFavourite(userid, id);
            navigate(0);
        } catch (error) {
            console.error('Ошибка при удалении из избранного', error);
            toast.error('Не удалось удалить магазин из избранного');
        }
    };

    const removeSpecialCharacters = (text) => {
        const emojiRegex = /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1F000}-\u{1FFFF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{2B50}|\u{FE0F}|\u{1F191}-\u{1F251}|\u{fe00}-\u{fe0f}|\u{31c0}-\u{31ef}|\u{1D300}-\u{1D3FF}]/gu;
        const specialCharacterRegex = /[〽️]/gu;

        return text.replace(emojiRegex, '').replace(specialCharacterRegex, '').trim();
    };


    return (
        <div className="w-[43vw] bg-[url(../public/ShopItemBG.svg)] bg-cover bg-no-repeat bg-center mt-[1vh] rounded-lg flex flex-col items-center relative">
            <div className="text-left w-[90%] text-black mt-[5%] text-[14px]">
                <p className='font-[OB] text-[16px]' style={{ whiteSpace: "normal", overflowWrap: "break-word" }}>{removeSpecialCharacters(name)}</p>
            </div>
            <img src={photo ? photo : 'https://ibb.org.ru/images/2024/11/14/brandcfed8cbf93f3f725.jpg'} alt={name} className='w-[90%] mt-1 object-cover rounded-lg' />
            <div className="w-[90%] mt-2">
                <p className='text-black text-[14px] text-left'>Надежность: {rating}%</p>
            </div>
            <button onClick={() => navigate(`/shop/${id}`)} className='w-[90%] h-7  mt-3 rounded-lg text-[14px] font-[OB]' style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}>
                перейти
            </button>
            <button onClick={handleDeleteToFavourite} className='w-[90%] h-7 mb-3 mt-2 rounded-lg text-[14px] font-[OB]' style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}>
                удалить
            </button>
        </div>
    );
}

export default MobileFavouriteShops