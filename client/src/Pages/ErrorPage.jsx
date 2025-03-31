import React from 'react'

const ErrorPage = () => {
  return (
    <div className='mt-5 flex items-center justify-center h-[87vh] relative'>
      <div className='absolute inset-0 bg-[url(../public/NotFoundBG.png)] bg-cover bg-no-repeat bg-center'></div>
      <div className='absolute inset-0 bg-black bg-opacity-60'></div>
      <div className="flex flex-col items-center relative z-10">
        <p className='text-[128px] font-[OB] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>404</p>
        <p className='text-[36px] font-[OB]'>NOT FOUND</p>
      </div>
    </div>
  )
}

export default ErrorPage