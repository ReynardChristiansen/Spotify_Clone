import React, { useState, useContext, useEffect } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import Navbar from './Navbar';
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineSearch } from 'react-icons/ai'

const Search = () => {
    const { playWithUrl } = useContext(PlayerContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [param, setParam] = useState('');
    const [song, setSong] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
        setParam(event.target.value);
    };

    useEffect(() => {
        setLoading(true);
        async function getSong() {
            try {
                const apiRes = await fetch(`https://saavn.dev/api/search/songs?query=${param}`);
                const final = await apiRes.json();

                setSong(final.data.results);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        getSong();
    }, [param]);

    if (!searchQuery) {
        return (
            <>
                <Navbar />
                <h2 className='text-2xl font-bold mb-10 mt-5 md:text-4xl text-center sm:text-xs'>What do you want to hear?</h2>

                <div className="relative mr-5 ml-5 mt-10">
                    <input
                        type="search"
                        placeholder='Search a song?'
                        className='w-full p-4 rounded-full bg-white text-black'
                        value={searchQuery}
                        onChange={handleInputChange}
                    />
                    <button className='absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-[#121212] rounded-full'>
                        <AiOutlineSearch />
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <h2 className='text-2xl font-bold mb-10 mt-5 md:text-4xl text-center sm:text-xs'>What do you want to hear?</h2>


            <div className="relative mr-5 ml-5 mt-10">
                <input
                    type="search"
                    placeholder='Search a song'
                    className='w-full p-4 rounded-full bg-white text-black'
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                <button className='absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-[#121212] rounded-full'>
                    <AiOutlineSearch />
                </button>
            </div>

            <div className='grid grid-cols-3 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
                <p>
                    Title
                </p>

                <p>Year</p>

                <p>Artist</p>
            </div>

            <hr />

            {loading ?
                <div className="flex justify-center items-center h-[50%]">
                    <ClipLoader
                        color="#4cabe6"
                        loading={loading}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
                :
                <div>
                    {song.map((item, index) => {
                        const downloadUrl =
                            item.downloadUrl[4] ? item.downloadUrl[4].url :
                                item.downloadUrl[3] ? item.downloadUrl[3].url :
                                    item.downloadUrl[2] ? item.downloadUrl[2].url :
                                        item.downloadUrl[1] ? item.downloadUrl[1].url :
                                            '';

                        const sliceName = (name) => {
                            const maxLength = 15;
                            return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
                        };

                        const sliceArtist = (name) => {
                            const maxLength = 20;
                            return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
                        };

                        return (
                            <div
                                onClick={() => playWithUrl(downloadUrl, item.image[2].url, item.name, item.id)}
                                key={index}
                                className='grid grid-cols-3 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer'
                            >
                                <p className='text-white'>
                                    <img className='inline w-10 mr-5' src={item.image[0].url} alt='Song' />
                                    {sliceName(item?.name)}
                                </p>

                                <p className='text-[15px]'>{item?.year ? item?.year : ''}</p>

                                <p className='text-[15px]'>{item?.artists?.primary[0]?.name ? sliceArtist(item.artists.primary[0].name) : ''}</p>
                            </div>
                            
                        );
                    })}
                </div>
            }
        </>
    );
};

export default Search;
