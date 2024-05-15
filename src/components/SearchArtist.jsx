import React, { useState, useContext, useEffect } from 'react';
import Navbar from './Navbar';
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineSearch } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

const SearchArtist = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [param, setParam] = useState('');
    const [artist, setArtist] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
        setParam(event.target.value);
    };

    useEffect(() => {
        setLoading(true);
        async function getArtist() {
            try {
                const apiRes = await fetch(`https://saavn.dev/api/search/artists?query=${param}`);
                const final = await apiRes.json();

                setArtist(final.data.results);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        getArtist();
    }, [param]);

    if (!searchQuery) {
        return (
            <>
                <Navbar />
                <h2 className='text-2xl font-bold mb-10 mt-5 md:text-4xl text-center sm:text-xs'>Find your favorite artist!</h2>


                <div className="relative mr-5 ml-5 mt-10">
                    <input
                        type="search"
                        placeholder='Search an artist?'
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

            <h2 className='text-2xl font-bold mb-10 mt-5 md:text-4xl text-center sm:text-xs'>Find your favorite artist!</h2>



            <div className="relative mr-5 ml-5 mt-10">
                <input
                    type="search"
                    placeholder='SearchArtist a song'
                    className='w-full p-4 rounded-full bg-white text-black' 
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                <button className='absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-[#121212] rounded-full'>
                    <AiOutlineSearch />
                </button>
            </div>

            <div className='grid grid-cols-2 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
                <p>
                    Title
                </p>


                <p>Type</p>
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
                    {artist.map((item, index) => {
                        const sliceName = (name) => {
                            const maxLength = 15;
                            return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
                        };

                        return (
                            <div
                                onClick={() => navigate(`/Detail/${item.id}`)}
                                key={index}
                                className='grid grid-cols-2 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer'
                            >
                                <p className='text-white'>
                                    <img className='inline w-10 mr-5' src={item.image[0].url} alt='' />
                                    {sliceName(item.name)}
                                </p>


                                <p className='text-[15px]'>{item.type}</p>
                            </div>
                        );
                    })}
                </div>
            }
        </>
    );
};

export default SearchArtist;
