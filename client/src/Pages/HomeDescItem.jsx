import React from 'react'

const HomeDescItem = ({name, telegram, element}) => {
    return (
        <>
            <div className="flex justify-between pt-6 pb-6 items-center brand_elem">
                <p className='text-[30px] font-[OL]'>{name}</p>
                <div className="flex">
                    <a href={telegram} className="mr-14 h-10 w-44 border flex justify-center items-center rounded-xl">
                        <p className='text-[20px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>TELEGRAM</p>
                    </a>
                    <a href={element} className="h-10 w-44 border flex justify-center items-center rounded-xl">
                        <p className='text-[20px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ELEMENT</p>
                    </a>
                </div>
            </div>
            <div className="h-[1px] w-full bg-white opacity-80"></div></>
    )
}

export default HomeDescItem