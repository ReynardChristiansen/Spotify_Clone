import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import SongItem from './SongItem';
import ClipLoader from "react-spinners/ClipLoader";

const DisplayHome = () => {
  const [albumEnglish, setAlbumEnglish] = useState([]);
  const [albumHindi, setAlbumHindi] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function getAlbumEnglish() {
      try {
        const apiRes = await fetch(`https://jiosaavan-api-2-harsh-patel.vercel.app/api/search/songs?query=english&page=1&limit=40`);
        const final = await apiRes.json();

        setAlbumEnglish(final.data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    async function getAlbumHindi() {
      try {
        const apiRes = await fetch(`https://jiosaavan-api-2-harsh-patel.vercel.app/api/search/songs?query=hindi&page=1&limit=40`);
        const final = await apiRes.json();

        setAlbumHindi(final.data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    getAlbumEnglish();
    getAlbumHindi();
  }, []);

  const truncateName = (name, maxLength) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name;
  };

  return (
    <>
      <Navbar />

      <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl'>Today's biggest hits</h1>

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
          <div className='flex overflow-auto'>
            {albumEnglish.map((item, index) => {
              const downloadUrl =
                item.downloadUrl[4]
                  ? item.downloadUrl[4].url
                  : item.downloadUrl[3]
                    ? item.downloadUrl[3].url
                    : item.downloadUrl[2]
                      ? item.downloadUrl[2].url
                      : item.downloadUrl[1]
                        ? item.downloadUrl[1].url
                        : '';

              return (
                <SongItem
                  key={index}
                  name={truncateName(item.name, 15)}
                  desc={item.label}
                  id={item.id}
                  image={item.image[2].url}
                  url={downloadUrl}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl'>Top Hindi Hits</h1>

        {
          loading ?
            <div className="flex justify-center items-center h-[20vh]">
              <ClipLoader
                color="#4cabe6"
                loading={loading}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
            :

            <div className='flex overflow-auto'>
              {albumHindi.map((item, index) => {
                const downloadUrl =
                  item.downloadUrl[4]
                    ? item.downloadUrl[4].url
                    : item.downloadUrl[3]
                      ? item.downloadUrl[3].url
                      : item.downloadUrl[2]
                        ? item.downloadUrl[2].url
                        : item.downloadUrl[1]
                          ? item.downloadUrl[1].url
                          : '';

                return (
                  <SongItem
                    key={index}
                    name={truncateName(item.name, 15)}
                    desc={item.label}
                    id={item.id}
                    image={item.image[2].url}
                    url={downloadUrl}
                  />
                );
              })}
            </div>
        }


      </div>
    </>
  );
};

export default DisplayHome;
