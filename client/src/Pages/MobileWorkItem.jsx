import React from 'react';
import { useNavigate } from 'react-router-dom';


const MobileWorkItem = ({name, city, category, zalog, text, photo, id, link}) => {
    const navigate = useNavigate()
    return (
        <div className='h-[180px] w-[90vw] bg-white mt-[20px] rounded-lg flex z-10'>
            <div className="w-[48% mt-2]">
                <img src={photo} alt={name} className='w-[132px] mt-2 max-h-[103px] min-h-[103px] object-cover rounded-lg ml-2' />
                <div className="text-[#646464] ml-3 mt-1 text-[12px]">
                    <p>Город: {city == "alm" ? "Алматы" : city == "ast" ? "Астана" : "Караганда"}</p>
                    <p>Товар: {category == "org" ? "Органика" : "Химия"}</p>
                    <p>Залог: От {zalog} ₸</p>
                </div>
            </div>
            <div className="w-[48%] mr-2 relative ml-4">
                <p className='mt-1 font-[OB] text-[16px] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>{name}</p>
                <p className='text-black text-[12px]' style={{ whiteSpace: "normal" }}>{text}</p>
                <button className='w-[100px] h-7 rounded-lg font-[OB] mt-2 absolute bottom-4 text-[12px]' style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}>
                    <a href={link}>связатся</a>
                </button>
            </div>
        </div>
    );
};

export default MobileWorkItem; 