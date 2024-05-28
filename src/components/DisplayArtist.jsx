import React, { useContext, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import ClipLoader from "react-spinners/ClipLoader";

const DisplayArtist = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [artistData, setArtisData] = useState([]);
    const [artistImage, setAArtistImage] = useState([]);
    const [artistSong, setArtistSong] = useState({});
    const { playWithUrl } = useContext(PlayerContext);

    useEffect(() => {
        setLoading(true);
        async function getArtist() {
            try {
                const apiRes = await fetch(`https://saavn.dev/api/artists/${id}`);
                const final = await apiRes.json();

                setArtisData(final.data);
                setAArtistImage(final.data.image[2].url ? final.data.image[2].url : final.data.image[1].url);
                setArtistSong(final.data.topSongs)


                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        getArtist();
    }, [id]);

    return (
        <>
            {
                loading ?
                    <div className="flex justify-center items-center h-[100%]">
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
                        <Navbar />

                        <div className='mt-10 flex gap-8 flex-col md:flex-row md:items-end'>
                            <img className='w-48 rounded-sm' src={artistImage} alt='' />

                            <div className='flex flex-col'>
                                <p>Playlist</p>
                                <h2 className='text-5xl font-bold mb-4 md:text-7xl'>{artistData.name}</h2>
                                <h4>{artistData.followerCount} - follower</h4>
                            </div>
                        </div>

                        <div className='grid grid-cols-3 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
                            <p>
                                Title
                            </p>

                            <p>Year</p>

                            <p>Artist</p>
                        </div>

                        <hr />

                        {artistSong.length > 0 &&
                            artistSong?.map((item, index) => {
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
                                            {sliceName(item.name)}
                                        </p>

                                        <p className='text-[15px]'>{item.year}</p>

                                        <p className='text-[15px]'>{sliceArtist(item.artists.primary[0].name)}</p>
                                    </div>
                                );
                            })
                        }
                    </div>

            }



        </>
    );
}

export default DisplayArtist;
