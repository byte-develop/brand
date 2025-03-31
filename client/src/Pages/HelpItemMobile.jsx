import React from 'react'

const HelpItemMobile = ({ name, photo, branch, telegram, element }) => {
    return (
        <>
            <div className="w-[150px] h-[200px] relative rounded-xl flex flex-col items-center" style={{ background: "linear-gradient(180deg, rgba(0,0,0,1) 2%, rgba(0,40,144,1) 47%, rgba(0,0,0,1) 94%)" }}>
                <img src={photo} alt="" className='mt-4 rounded-full h-[83px] w-[83px] object-cover' />
                <div className="flex flex-col items-center text-[16px] mt-2">
                    <p>{name}</p>
                    <p>{branch}</p>
                </div>
                <div className="flex items-center mt-3">
                    <a href={element}>
                        <img src="../public/elem.png" alt="" className='h-[25px]' />
                    </a>
                    <a href={telegram}>
                        <img src="../public/tg.png" alt="" className='h-[25px] ml-5' />
                    </a>
                </div>
            </div>
        </>
    )
}

export default HelpItemMobile