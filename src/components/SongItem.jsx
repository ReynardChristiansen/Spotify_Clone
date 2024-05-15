import React from 'react'
import { PlayerContext } from '../context/PlayerContext';
import { useContext } from 'react';

const SongItem = ({ name, image, desc, id, url }) => {
  const { playWithUrl } = useContext(PlayerContext);

  return (
    <div onClick={() => playWithUrl(url, image, name, id)} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
      <img className='rounded' src={image}></img>
      <p className='font-bold mt-2 mb-1'>{name}</p>
      <p className='text-slate-200 text-sm'>{desc}</p>
    </div>
  )
}

export default SongItem;