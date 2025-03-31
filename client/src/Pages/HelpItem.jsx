import React from 'react'

const HelpItem = ({name, photo, branch, telegram, element}) => {
    return (
        <>
            <div className="w-[318px] h-[429px] rounded-xl relative flex flex-col items-center" style={{ background: "linear-gradient(180deg, rgba(0,0,0,1) 2%, rgba(0,40,144,1) 47%, rgba(0,0,0,1) 94%)" }}>
                <img src={photo} alt="" className='mt-7  rounded-full w-[210px] h-[210px] object-cover' />
                <div className="flex flex-col items-center text-[20px] mt-6">
                    <p>{name}</p>
                    <p>{branch}</p>
                </div>
                <div className="flex items-center mt-3">
                    <a href={element}>
                        <img src="../public/elem.png" alt="" className='h-[55px]' />
                    </a>
                    <a href={telegram}>
                        <img src="../public/tg.png" alt="" className='h-[55px] ml-10' />
                    </a>
                </div>
            </div>
        </>
    )
}

export default HelpItem