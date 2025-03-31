import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTokenToLocalStorage } from '../helpers/localstorage.helper';
import { AuthService } from '../services/auth.service';
import { LoginSlice } from '../store/user/userSlice';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

const UpdatePhoto = ({ userId }) => {
    const [fileName, setFileName] = useState('Выбрать файл');
    const [photoFile, setPhotoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


    const handleFileChange = (e) => {
        setPhotoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!photoFile) return;

        setLoading(true);
        try {
            const photoUrl = await AuthService.uploadPhoto(photoFile);

            const response = await AuthService.updateUserProfile({ id: userId, photo: photoUrl });
            dispatch(LoginSlice(response.user));
            setTokenToLocalStorage('token', response.token);
            toast.success('Фото успешно обновлено!')
        } catch (error) {
            toast.error('Ошибка при обновлении фото.');
        } finally {
            setLoading(false);
        }
    };


    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName('Нажмите, чтобы выбрать файл');
        }
        handleFileChange(e);
    };

    return (
        <>
            {isMobile ?

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="mt-2 w-[40vw] flex items-center text-[14px] justify-center p-2 border-2 border-dashed border-[#120082] rounded-lg cursor-pointer hover:bg-[#003AD1] hover:bg-opacity-20 transition duration-200 ease-in-out">
                            <input
                                type="file"
                                onChange={handleFileInputChange}
                                required
                                disabled={loading}
                                className="hidden"
                            />
                            <span className="text-[#003AD1]">{fileName}</span>
                        </label>

                        <button
                            className='p-2 w-[40vw] text-[14px] rounded-xl mt-4'
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
                            ) : "Изменить фото"}
                        </button>
                    </div>
                </form>

                :

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="mt-4 w-[300px] flex items-center justify-center p-4 border-2 border-dashed border-[#120082] rounded-lg cursor-pointer hover:bg-[#003AD1] hover:bg-opacity-20 transition duration-200 ease-in-out">
                            <input
                                type="file"
                                onChange={handleFileInputChange} 
                                required
                                disabled={loading}
                                className="hidden"
                            />
                            <span className="text-[#003AD1]">{fileName}</span> 
                        </label>

                        <button
                            className='p-3 w-[300px] rounded-xl mt-4'
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
                            ) : "Изменить фото"}
                        </button>
                    </div>
                </form>
            }
        </>
    );
};

export default UpdatePhoto;