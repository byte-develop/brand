import React from 'react'

const HomeItem = ({name, telegram, element}) => {
    return (
        <>
            <div className="flex justify-between pt-3 pb-3 items-center">
                <p className='text-[16px] font-[OL]'>{name}</p>
                <div className="flex">
                    <a href={telegram} className="mr-2 h-6 px-3 border flex justify-center items-center rounded-xl">
                        <p className='text-[11px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>TELEGRAM</p>
                    </a>
                    <a href={element} className="h-6 px-3 border flex justify-center items-center rounded-xl">
                        <p className='text-[11px] text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ELEMENT</p>
                    </a>
                </div>
            </div>
            <div className="h-[1px] w-full bg-white opacity-80"></div>
        </>
    )
}

export default HomeItem