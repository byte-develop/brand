import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTokenToLocalStorage } from '../helpers/localstorage.helper';
import { AuthService } from '../services/auth.service';
import { LoginSlice } from '../store/user/userSlice';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

const UpdateEmail = ({ userId, currentEmail, disable, setDisable }) => {
    const [newEmail, setNewEmail] = useState(currentEmail);
    const dispatch = useDispatch();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.updateEmail({ id: userId, newEmail });
            dispatch(LoginSlice(response.user));
            setTokenToLocalStorage('token', response.token);
            toast.success('Электронная почта успешно обновлена!');
        } catch (error) {
            toast.error('Ошибка при изменении электронной почты.')
        }
    };

    return (
        <>
            {
                isMobile ?

                    <form onSubmit={handleSubmit} className='max-w-[45vw]'>
                        <div className="flex flex-col">
                            <input
                                className='text-black mt-2 px-2 py-1 rounded-full w-[45vw] text-[14px]'
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Введите новый email"
                                required
                                disabled={disable}
                            />
                            <button type="submit"
                                className='p-2 w-[45vw] rounded-xl mt-2 text-[14px]'
                                style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}>
                                Сохранить
                            </button>
                        </div>
                    </form>

                    :

                    <form onSubmit={handleSubmit} className='max-w-[300px]'>
                        <div className="flex flex-col">
                            <input
                                className='text-black mt-2 px-3 py-1 rounded-full w-[300px]'
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Введите новый email"
                                required
                                disabled={disable}
                            />
                            <button type="button" onClick={() => setDisable(!disable)} className='text-end text-[14px] text-[#003AD1]'>изменить почту </button>
                            <button type="submit"
                                className='p-2 w-[300px] rounded-xl mt-4'
                                style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}>
                                Сохранить
                            </button>
                        </div>
                    </form>
            }
        </>
    );
};

export default UpdateEmail;