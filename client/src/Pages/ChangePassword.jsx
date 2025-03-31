import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTokenToLocalStorage } from '../helpers/localstorage.helper';
import { AuthService } from '../services/auth.service';
import { LoginSlice } from '../store/user/userSlice';
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';


const ChangePassword = ({ userId }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


    const [hide1, setHide1] = useState(true);
    const [hide2, setHide2] = useState(true);

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length >= 6) {
            setLoading(true);
            try {
                const response = await AuthService.changePassword({ userId, oldPassword, newPassword });
                dispatch(LoginSlice(response.user));
                setTokenToLocalStorage('token', response.token);
                toast.success('Пароль успешно изменен!');
            } catch (error) {
                toast.error('Ошибка при изменении пароля.');
            } finally {
                setLoading(false);
            }
        } else {
            toast.error('Пароль должен быть не менее 6 символов')
        }
    };

    return (
        <>
            {isMobile ?

                <form onSubmit={handleSubmit} className='mt-1'>
                    <div className="flex flex-col max-w-[45vw]">
                        <div className="relative w-full">
                            <input
                                type={hide1 ? "password" : "text"}
                                placeholder="Старый пароль"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                                className="text-black mt-2 text-[14px] px-2 py-1 rounded-full w-full"
                            />
                            <button type='button' onClick={() => setHide1(!hide1)}>
                                {hide1 ?

                                    <IoEyeOffOutline className='absolute right-2 top-[35%]' color='gray' size={20} />

                                    :

                                    < IoEyeOutline className='absolute right-2 top-[35%]' color='gray' size={20} />

                                }
                            </button>
                        </div>
                        <div className="relative w-full">
                            <input
                                type={hide2 ? "password" : "text"}
                                placeholder="Новый пароль"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="text-black text-[14px] px-2 py-1 rounded-full mt-4 w-full"
                            />
                            <button type='button' onClick={() => setHide2(!hide2)}>
                                {hide2 ?

                                    <IoEyeOffOutline className='absolute right-2 top-[45%]' color='gray' size={20} />

                                    :

                                    < IoEyeOutline className='absolute right-2 top-[45%]' color='gray' size={20} />

                                }                    </button>
                        </div>
                        <button
                            className='p-2 w-[45vw] text-[14px] rounded-xl mt-3 '
                            style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className='flex items-center justify-center'>
                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                    </svg>
                                    Загрузка...
                                </div>
                            ) : "Изменить пароль"}
                        </button>
                    </div>
                </form>

                :

                <form onSubmit={handleSubmit} className='mt-2'>
                    <div className="flex flex-col max-w-[300px]">
                        <div className="relative w-full">
                            <input
                                type={hide1 ? "password" : "text"}
                                placeholder="Старый пароль"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                                className="text-black mt-2 px-3 py-1 rounded-full w-full"
                            />
                            <button type='button' onClick={() => setHide1(!hide1)}>
                                {hide1 ?

                                    <IoEyeOffOutline className='absolute right-2 top-[35%]' color='gray' size={20} />

                                    :

                                    < IoEyeOutline className='absolute right-2 top-[35%]' color='gray' size={20} />

                                }
                            </button>
                        </div>
                        <div className="relative w-full">
                            <input
                                type={hide2 ? "password" : "text"}
                                placeholder="Новый пароль"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="text-black px-3 py-1 rounded-full mt-4 w-full"
                            />
                            <button type='button' onClick={() => setHide2(!hide2)}>
                                {hide2 ?

                                    <IoEyeOffOutline className='absolute right-2 top-[45%]' color='gray' size={20} />

                                    :

                                    < IoEyeOutline className='absolute right-2 top-[45%]' color='gray' size={20} />

                                }                    </button>
                        </div>
                        <button
                            className='p-2 w-[300px] rounded-xl mt-6 '
                            style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className='flex items-center justify-center'>
                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                        <path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51s1 .675 .9999999999999999 .317c-.00000000000000001 .728-.5860000000000003 .318-.9999999999999999 .318zm4 .227c-.723 .0000000000000003 -3 .0000000000000003 -3 .0000000000000003 -.723 .000000000000001 -3 .000000000000001 -3 .000000000000001z" fill="#979797" />
                                    </svg>
                                    Загрузка...
                                </div>
                            ) : "Изменить пароль"}
                        </button>
                    </div>
                </form>
            }
        </>
    );
};

export default ChangePassword;