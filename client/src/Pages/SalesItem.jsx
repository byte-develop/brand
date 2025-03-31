import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

const SalesItem = ({ photo, id, name, text, links, color }) => {
    const [imgHeight, setImgHeight] = useState(0);
    const [buttons, setButtons] = useState([]);

    useEffect(() => {
        const img = new Image();
        img.src = photo;
        img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const width = window.innerWidth * 0.8;
            const height = width / aspectRatio;
            setImgHeight(height);
        };
    }, []);

    useEffect(() => {
        const parts = links.split(' | ');
        const buttonsData = parts.map(part => {
            const [name, link] = part.split(' - ');
            return { name, link };
        });
        setButtons(buttonsData)
    }, [links]);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <>
            {
                isMobile ?

                    <div className="w-[80%] mx-auto relative rounded-[15px] flex items-center flex-col justify-end" style={{ height: imgHeight }}>
                        {
                            links ?

                                <>
                                    {buttons.length <= 3 ?

                                        <div className='flex flex-wrap justify-center gap-3 mb-12'>
                                            {buttons.map((button, index) => (
                                                <a key={index} href={button.link} target="_blank" rel="noopener noreferrer">
                                                    <button
                                                        className='w-[85px] h-[25px] z-10 relative rounded-lg text-[14px] font-[OEB]'
                                                        style={{
                                                            background: color,
                                                            boxShadow: `0px 0px 30px ${color}`,
                                                        }}
                                                    >
                                                        {button.name}
                                                    </button>
                                                </a>
                                            ))}
                                        </div>

                                        :

                                        <div className='flex flex-wrap justify-center gap-3 mb-4'>
                                            {buttons.map((button, index) => (
                                                <a key={index} href={button.link} target="_blank" rel="noopener noreferrer">
                                                    <button
                                                        className='w-[85px] h-[25px] z-10 relative rounded-lg text-[14px] font-[OEB]'
                                                        style={{
                                                            background: color,
                                                            boxShadow: `0px 0px 30px ${color}`,
                                                        }}
                                                    >
                                                        {button.name}
                                                    </button>
                                                </a>
                                            ))}
                                        </div>

                                    }
                                </>

                                :

                                <p>Загрузка...</p>


                        }
                        <img src={photo} alt={name} className="absolute top-0 left-0 w-full h-full object-cover rounded-[15px]" />
                    </div>

                    :

                    <div className="w-[80%] mx-auto relative rounded-[40px] flex items-center flex-col justify-end" style={{ height: imgHeight }}>
                        {
                            links ?

                                <div className='flex items-center gap-5'>
                                    {buttons.map((button, index) => (
                                        <a key={index} href={button.link} target="_blank" rel="noopener noreferrer">
                                            <button
                                                className='w-[215px] h-[60px] z-10 relative rounded-2xl mb-9 text-[28px] font-[OEB]'
                                                style={{
                                                    background: color,
                                                    boxShadow: `0px 0px 30px ${color}`,
                                                }}
                                            >
                                                {button.name}
                                            </button>
                                        </a>
                                    ))}
                                </div>

                                :

                                <p>Загрузка...</p>


                        }
                        <img src={photo} alt={name} className="absolute top-0 left-0 w-full h-full object-cover rounded-[40px]" />
                    </div>
            }
        </>
    );
};

export default SalesItem;
