import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';

const Player = () => {

  const { seekBar, seekBg, play, pause, track, time, playStatus, seekSong, playNextSong, previousSong, like, likesong } = useContext(PlayerContext);
  const [isLiked, setIsLiked] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (likesong.length > 0) {
      const isLikedTrack = likesong.some(item => item.song_id === track.id);

      setIsLiked(isLikedTrack);

      if (isLiked == false) {
        setClicked(false);
      }
    }
  }, [likesong, track.id]);

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

  const handleLike = (url, image, name, id) => {
    setClicked(true);
    like(url, image, name, id)
  }

  const sliceName = (name) => {
    const maxLength = 10;
    return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
  };



  const formatTime = (value) => {
    value = value.toString();
    return value.length === 1 ? `0${value}` : value;
  };

  return (
    <div className='lg:h-[12%] sm:h-[15%] bg-black flex justify-between items-center text-white px-4'>

      <div className='hidden lg:flex items-center gap-4'>
        {track.image && <img className='w-12' src={track.image} alt='' />}
        <div>
          <p>{sliceName(track.name)}</p>
        </div>

        {!isLiked && !clicked ? (
          <img onClick={() => handleLike(track.url, track.image, track.name, track.id)} className='w-5 cursor-pointer' src={assets.like} alt='Like' />
        ) : (
          <img className='w-5' src={assets.likeFull} alt='Like' />
        )}




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

      <div className='hidden lg:flex items-center gap-2'>
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
