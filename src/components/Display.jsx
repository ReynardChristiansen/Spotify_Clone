import React, { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import DisplayHome from './DisplayHome';
import Search from './Search';
import SearchArtist from './SearchArtist';
import DisplayArtist from './DisplayArtist';
import Like from './Like';

const Display = () => {
  const location = useLocation();
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const isArtist = location.pathname.includes("Detail");
  const displayRef = useRef();

  useEffect(() => {
    const bgColor = getRandomColor();

    if (isArtist) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`
    }
    else {
      displayRef.current.style.background = ` #121212`
    }
  }, [location.pathname])

  return (
    <div ref={displayRef} className='w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'>
      <Routes>
        <Route path='/' element={<DisplayHome />} />
        <Route path='/Detail/:id' element={<DisplayArtist />} />
        <Route path='/SearchSong' element={<Search />} />
        <Route path='/SearchArtist' element={<SearchArtist />} />
        <Route path='/Like' element={<Like />} />
      </Routes>
    </div>
  )
}



export default Display;