import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className='flex lg:w-[25%] h-full p-2 flex-col gap-2 text-white'>
            <img
                className='lg:hidden p-2 bg-[#121212] text-white rounded cursor-pointer'
                onClick={toggleSidebar}
                src={!isSidebarOpen ? assets.menu : assets.close}
            >
            </img>

            <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-auto lg:mt-70`}>
                <div className='bg-[#121212] sm:text-sm sm:p-1 lg:p-4 h-[100%] lg:text-xl lg:h-[100%] rounded flex flex-col justify-around'>
                    <div onClick={() => navigate('/')} className='flex items-center gap-3 p-1.5 cursor-pointer lg:pl-8 lg:py-2'>
                        <img className='w-10' src={assets.home_icon} alt="Home Icon"></img>
                        <p className={`font-bold ${!isSidebarOpen ? 'block' : 'hidden'}`}>Home</p>
                    </div>

                    <div onClick={() => navigate('/SearchSong')} className='flex items-center gap-3 p-1.5 cursor-pointer lg:pl-8 lg:py-2'>
                        <img className='w-10' src={assets.search_icon} alt="Search Icon"></img>
                        <p className={`font-bold ${!isSidebarOpen ? 'block' : 'hidden'}`}>Search</p>
                    </div>

                    <div onClick={() => navigate('/SearchArtist')} className='flex items-center gap-3 p-1.5 cursor-pointer lg:pl-8 lg:py-2'>
                        <img className='w-10' src={assets.artist} alt="Artist Icon"></img>
                        <p className={`font-bold ${!isSidebarOpen ? 'block' : 'hidden'}`}>Artist</p>
                    </div>
                </div>


            </div>



            <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block  lg:w-auto lg:mt-70`}>
                <div className='bg-[#121212] sm:text-sm sm:p-1 lg:p-4 h-[100%] lg:text-xl lg:h-[100%] rounded '>
                    <div onClick={() => navigate('/Like')} className='flex items-center gap-3 p-1.5 cursor-pointer lg:pl-8 lg:py-2 lg:mb-[110%] md:mb-[120%] sm:[1000%]'>
                        <img className='w-10' src={assets.like_icon} alt="Like Icon"></img>
                        <p className={`font-bold ${!isSidebarOpen ? 'block' : 'hidden'}`}>Like</p>
                    </div>
                </div>

                
            </div>

        </div>
    )
}

export default Sidebar;