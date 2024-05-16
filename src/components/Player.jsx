import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';

const Player = () => {
  const { seekBar, seekBg, play, pause, track, time, playStatus, seekSong, playNextSong, previousSong } = useContext(PlayerContext);


  const handlePlay = () => {
    play();

  };

  const handleNextSong = () => {
    playNextSong();
  }

  const handlePrevious = () => {
    previousSong();
  }

  const handlePause = () => {
    pause();
  };

  const formatTime = (value) => {
    value = value.toString();
    return value.length === 1 ? `0${value}` : value;
  };

  return (
    <div className='h-[10%] bg-black flex justify-between items-center text-white px-4'>

      <div className='hidden lg:flex items-center gap-4'>
        {track.image && <img className='w-12' src={track.image} alt='' />}
        <div>
          <p>{track.name}</p>
        </div>
      </div>

      <div className='flex flex-col items-center gap-1 m-auto'>
        <div className='flex gap-4'>
          <img onClick={handlePrevious} className='w-4 cursor-pointer' src={assets.prev_icon} alt='Previous'></img>
          {track.name ? (
            <>
              {playStatus ? (
                <img onClick={handlePause} className='w-4 cursor-pointer' src={assets.pause_icon} alt='Pause'></img>
              ) : (
                <img onClick={handlePlay} className='w-4 cursor-pointer' src={assets.play_icon} alt='Play'></img>
              )}
            </>
          ) : (
            <img className='w-4 opacity-40' src={assets.play_icon} alt='Play' title='No track available'></img>
          )}
          <img onClick={handleNextSong} className='w-4 cursor-pointer' src={assets.next_icon} alt='Next'></img>
        </div>

        <div className='flex items-center gap-5'>
          <p>{formatTime(time.currentTime.minute)}:{formatTime(time.currentTime.second)}</p>
          <div ref={seekBg} onClick={seekSong} className='w-[60vw] max-w-[500px] mt-2 bg-gray-300 rounded-full cursor-pointer'>
            <hr ref={seekBar} className='h-1 border-none w-0 bg-[#4ca1e6] rounded-full' />
          </div>
          <p>{formatTime(time.totalTime.minute || "00")}:{formatTime(time.totalTime.second || "00")}</p>
        </div>

      </div>

      <div className='hidden lg:flex items-center gap-2 opacity-75'>
        <img className='w-4 cursor-pointer' src={assets.shuffle_icon} alt='Shuffle'></img>
        <img className='w-4' src={assets.play_icon} alt='Play'></img>
        <img className='w-4' src={assets.mic_icon} alt='Mic'></img>
        <img className='w-4' src={assets.queue_icon} alt='Queue'></img>
        <img className='w-4' src={assets.speaker_icon} alt='Speaker'></img>
        <img className='w-4' src={assets.volume_icon} alt='Volume'></img>
        <div className='w-20 bg-slate-50 h-1 rounded'></div>
        <img className='w-4' src={assets.mini_player_icon} alt='Mini Player'></img>
        <img className='w-4' src={assets.zoom_icon} alt='Zoom'></img>
      </div>

    </div>
  );
};

export default Player;
