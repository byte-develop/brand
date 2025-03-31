import React from 'react'
import { IoCopyOutline } from "react-icons/io5";

const PromocodeItem = ({ promocode, bonus, status }) => {
  return (
    <div className={`min-w-[206px] h-[93px] ${status ? 'bg-[url(../public/promo.png)]' : 'bg-[url(../public/promo_used.png)] '} bg-cover bg-center flex flex-col items-center`}>
      <p className='mt-[6px] text-[15px] font-[OSB]'>{status ? bonus : "АКТИВИРОВАН"}</p>
      <div className='flex items-center gap-2'>
        <p className='text-[24px] mt-[22px] font-[OSB]'>{promocode}</p>
        <button
          onClick={() => navigator.clipboard.writeText(promocode)}
          className='mt-[22px]'
        >
          <IoCopyOutline size={26}/>
        </button>
      </div>
    </div>
  )
}

export default PromocodeItem    