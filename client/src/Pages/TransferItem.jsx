import React from 'react'

const TransferItem = ({ id_user, price, date, name }) => {
  return (
    <div className='bg-[#1F1F1F] bg-opacity-[44%] w-[328px] h-[68px] rounded-[20px] flex justify-between'>
      <div className="pt-[10px] pl-[15px]">
        <p className='font-[OB] text-[18px] '>{name}</p>
        <p className='font-[OB] text-[16px] text-[#0600B7]'>{new Date(date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ' -')}</p>
      </div>

      <div className="pr-[15px] pt-[10px]">
        <p className='font-[OB] text-[18px]'>{price}</p>
      </div>
    </div>
  )
}

export default TransferItem