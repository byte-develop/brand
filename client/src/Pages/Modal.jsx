import React, { useEffect, useState } from 'react';
import { AuthService } from '../services/auth.service';
import { IoStar } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

const Modal = ({ onClose, id }) => {
    const [quantity, setQuantity] = useState(0);
    const [text, setText] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


    const checkData = async () => {
        const data = await AuthService.getMe();
        if (data) {
            setData(data);
        }
    };

    useEffect(() => {
        checkData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (text.length > 600) {
            toast.error("Текст не должен быть больше 600 символов");
            return;
        }

        if (quantity === 0) {
            toast.error("Укажите свою оценку");
            return;
        }

        const feedbackData = { login: data.login, id_shop: id, quantity, text, UserId: data.id };

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
            });

            if (!response.ok) {
                toast.error('Ошибка при отправке данных');
                return;
            }

            onClose();
            setLoading(false);
            toast.success("Ваш отзыв успешно отправлен. После проверки модератором он будет опубликован.");

        } catch (error) {
            toast.error('Ошибка сети');
        }
    };

    return (
        <>
            {isMobile ?

                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" >
                    <form onSubmit={handleSubmit} className='rounded-xl px-5 w-[80%] h-[392px] flex flex-col text-black border-[1px] border-opacity-20 border-white' style={{ background: 'linear-gradient(180deg, rgba(0,0,0,1) 2%, rgba(0,40,144,1) 47%, rgba(0,0,0,1) 94%)' }}>
                        <div onClick={() => onClose()} className="relative cursor-pointer">
                            <div className="absolute h-[2px] w-4 bg-white rotate-45 right-0 top-5"></div>
                            <div className="absolute h-[2px] w-4 bg-white rotate-[-45deg] right-0 top-5"></div>
                        </div>
                        <div className="mt-3">
                            <p className='font-[OSB] text-white'>Ваша оценка</p>
                            <div className="h-12 bg-white rounded-2xl flex items-center mt-2">
                                <div className="flex ml-4">
                                    <button type='button' onClick={() => setQuantity(1)}><IoStar size={26} color='#003AD1' opacity={quantity == 0 ? .3 : 1} /></button>
                                    <button type='button' onClick={() => setQuantity(2)}><IoStar size={26} color='#003AD1' opacity={quantity <= 1 ? .3 : 1} /></button>
                                    <button type='button' onClick={() => setQuantity(3)}><IoStar size={26} color='#003AD1' opacity={quantity <= 2 ? .3 : 1} /></button>
                                    <button type='button' onClick={() => setQuantity(4)}><IoStar size={26} color='#003AD1' opacity={quantity <= 3 ? .3 : 1} /></button>
                                    <button type='button' onClick={() => setQuantity(5)}><IoStar size={26} color='#003AD1' opacity={quantity <= 4 ? .3 : 1} /></button>
                                </div>
                            </div>
                        </div>
                        <div className='relative'>
                            <p className='font-[OSB] text-white mt-3'>Текст отзыва</p>
                            <textarea
                                className="w-full h-[185px] rounded-2xl mt-2 resize-none p-4"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                            <div className={text.length > 600 ? "absolute bottom-4 right-4 text-red-600" : "absolute bottom-4 right-4 text-gray-500"}>
                                {text.length}/600
                            </div>
                        </div>
                        <div className="w-full relative mt-4">
                            <button type='submit' className='w-[152px] h-[32px] rounded-xl font-[OSB] text-white absolute right-0' style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}>
                                {loading ? (
                                    <div className='flex items-center justify-center'>
                                        <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                            <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                        </svg>
                                        Отправка...
                                    </div>
                                ) : "Отправить"}
                            </button>
                        </div>
                    </form>
                </div>


                :

                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" >
                    <form onSubmit={handleSubmit} className='rounded-xl px-5 w-[612px] h-[392px] flex flex-col text-black border-[1px] border-opacity-20 border-white' style={{ background: 'linear-gradient(180deg, rgba(0,0,0,1) 2%, rgba(0,40,144,1) 47%, rgba(0,0,0,1) 94%)' }}>
                        <div onClick={() => onClose()} className="relative cursor-pointer">
                            <div className="absolute h-[2px] w-4 bg-white rotate-45 right-0 top-5"></div>
                            <div className="absolute h-[2px] w-4 bg-white rotate-[-45deg] right-0 top-5"></div>
                        </div>
                        <div className="mt-3">
                            <p className='font-[OSB] text-white'>Ваша оценка</p>
                            <div className="h-12 bg-white rounded-2xl flex items-center mt-2">
                                <div className="flex ml-4">
                                    <button type='button' onClick={() => setQuantity(1)}><IoStar size={26} color='#003AD1' opacity={quantity == 0 ? .3 : 1} /></button>
                                    <button type='button' onClick={() => setQuantity(2)}><IoStar size={26} color='#003AD1' opacity={quantity <= 1 ? .3 : 1} /></button>
                                    <button type='button' onClick={() => setQuantity(3)}><IoStar size={26} color='#003AD1' opacity={quantity <= 2 ? .3 : 1} /></button>
                                    <button type='button' onClick={() => setQuantity(4)}><IoStar size={26} color='#003AD1' opacity={quantity <= 3 ? .3 : 1} /></button>
                                    <button type='button' onClick={() => setQuantity(5)}><IoStar size={26} color='#003AD1' opacity={quantity <= 4 ? .3 : 1} /></button>
                                </div>
                            </div>
                        </div>
                        <div className='relative'>
                            <p className='font-[OSB] text-white mt-3'>Текст отзыва</p>
                            <textarea
                                className="w-full h-[185px] rounded-2xl mt-2 resize-none p-4"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                            <div className={text.length > 600 ? "absolute bottom-4 right-4 text-red-600" : "absolute bottom-4 right-4 text-gray-500"}>
                                {text.length}/600
                            </div>
                        </div>
                        <div className="w-full relative mt-4">
                            <button type='submit' className='w-[152px] h-[32px] rounded-xl font-[OSB] text-white absolute right-0' style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}>
                                {loading ? (
                                    <div className='flex items-center justify-center'>
                                        <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                            <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                        </svg>
                                        Отправка...
                                    </div>
                                ) : "Отправить"}
                            </button>
                        </div>
                    </form>
                </div>

            }
        </>
    );
};

export default Modal;