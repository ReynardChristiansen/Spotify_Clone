import React, { useContext, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';
import ClipLoader from "react-spinners/ClipLoader";

const Like = () => {
    const [song, setSong] = useState([]);
    const { playWithUrl, deleteSong, playStatus, pause } = useContext(PlayerContext);
    const [loading, setLoading] = useState(false);

    const handlePause = () => {
        pause();
    };

    const fetchLikedSongs = async () => {
        setLoading(true);
        try {
            const apiRes = await fetch(`https://api-song-khaki.vercel.app/api/songs`);
            const final = await apiRes.json();
            setSong(final);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLikedSongs();
    }, []);

    const handleDeleteSong = async (songId) => {
        try {
            await deleteSong(songId);
            fetchLikedSongs();
        } catch (error) {
            console.log(error);
        }
    };

    const handlePlayRandomLikedSong = () => {
        if (song.length > 0) {
            const randomIndex = Math.floor(Math.random() * song.length);
            const randomSong = song[randomIndex];
            playWithUrl(randomSong.song_url, randomSong.song_image, randomSong.song_name, randomSong.song_id);
        }
    };

    return (
        <div>
            <Navbar />

            <div className='mt-10 flex gap-8 flex-col md:flex-row md:items-end'>
                <img className='w-48 rounded-sm' src="https://pics.craiyon.com/2023-09-09/cc1b77bc7d244b61ad826978eb9d0b04.webp" alt='' />

                <div className='flex flex-col'>
                    <p>Playlist</p>
                    <h2 className='text-5xl font-bold mb-4 md:text-7xl'>Liked Songs</h2>
                    <h4>Reynard - {song.length} songs</h4>

                    {!playStatus ? (
                        <img
                            className='w-10 cursor-pointer rounded-full bg-blue-500 p-3 mt-5'
                            src={assets.play_icon}
                            alt='Play'
                            onClick={handlePlayRandomLikedSong}
                        />
                    ) : (
                        <img
                            className='w-10 cursor-pointer rounded-full bg-blue-500 p-3 mt-5'
                            src={assets.pause_icon}
                            alt='Pause'
                            onClick={handlePause}
                        />
                    )}



                </div>
            </div>

            <div className='grid grid-cols-3 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
                <p>Title</p>
                <p>Playlist</p>
                <p>Action</p>
            </div>

            <hr />

            {loading ? (
                <div className="flex justify-center items-center h-[20vh]">
                    <ClipLoader
                        color="#4cabe6"
                        loading={loading}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            ) : (
                song && song.length !== 0 && (
                    <div>
                        {song.map((item, index) => {
                            const sliceName = (name) => {
                                const maxLength = 15;
                                return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
                            };

                            return (
                                <div
                                    key={index}
                                    className='grid grid-cols-3 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer'
                                    onClick={() => playWithUrl(item.song_url, item.song_image, item.song_name, item.song_id)}
                                >
                                    <p className='text-white'>
                                        <img className='inline w-10 mr-5' src={item.song_image} alt='Song Thumbnail' />
                                        {sliceName(item.song_name)}
                                    </p>

                                    <p>
                                        Reynard
                                    </p>

                                    <p>
                                        <img
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSong(item._id);
                                            }}
                                            className='w-5'
                                            src={assets.trash}
                                            alt='Delete Icon'
                                        />
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
};

export default Like;
