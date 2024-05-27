import { createContext, useRef, useState, useEffect } from "react";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    const [playlistHistory, setPlaylistHistory] = useState([]);
    const [likesong, setLikesong] = useState([]);


    const [track, setTrack] = useState({
        id: "mhycwNJZ",
        image: "https://c.saavncdn.com/519/Being-Funny-In-A-Foreign-Language-English-2022-20221125000319-500x500.jpg",
        name: "About You",
        url: "https://aac.saavncdn.com/519/6ad3d1794471c6663f90b3ea05b62b89_320.mp4"
    });

    const [playStatus, setPlayStatus] = useState(false);
    const [artist, setArtist] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [id, setId] = useState("");

    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    });

    useEffect(() => {
        const updateSeekBar = () => {
            const currentTime = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            seekBar.current.style.width = `${(currentTime / duration) * 100}%`;

            setTime({
                currentTime: {
                    second: Math.floor(currentTime % 60),
                    minute: Math.floor(currentTime / 60)
                },
                totalTime: {
                    second: Math.floor(duration % 60),
                    minute: Math.floor(duration / 60)
                }
            });

            if (currentTime === duration) {
                setPlayStatus(false);
                playWithUrl(downloadUrl, image, name, id);
            }
        };

        if (audioRef.current) {
            audioRef.current.ontimeupdate = updateSeekBar;
            audioRef.current.volume = 0.4;
        }
    }, [downloadUrl, image, name, id]);

    //---------------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        async function getArtist() {
            try {
                const apiRes = await fetch(`https://saavn.dev/api/songs/${track.id}`);
                const final = await apiRes.json();
                const newArtistId = final.data[0].artists.primary[0].id + "";
                setArtist(newArtistId);

                if (newArtistId) {
                    try {
                        const apiRes = await fetch(`https://saavn.dev/api/artists/${newArtistId}`);
                        const final_temp = await apiRes.json();

                        const randomIndex = Math.floor(Math.random() * final_temp.data.topSongs.length);
                        const randomSong = final_temp.data.topSongs[randomIndex];

                        if (track.id === randomSong.id) {
                            getArtist();
                        } else {

                            try {
                                const apiRes = await fetch(`https://api-song-khaki.vercel.app/api/songs`);
                                const tempss = await apiRes.json();
                                const filteredSongs = tempss.filter(song => song.song_id !== track.id);


                                if (filteredSongs.length == tempss.length - 1) {
                                    const randomIndex = Math.floor(Math.random() * filteredSongs.length);
                                    const randomSong = filteredSongs[randomIndex];

                                    if (randomSong.song_id == track.id) {
                                        getArtist();
                                    }
                                    else {
                                        setDownloadUrl(randomSong.song_url);
                                        setImage(randomSong.song_image);
                                        const songName = randomSong.song_name.length > 15 ? randomSong.song_name.slice(0, 15) + "..." : randomSong.song_name;
                                        setName(songName);
                                        setId(randomSong.song_id);
                                    }

                                } else {
                                    setDownloadUrl(randomSong.downloadUrl[4].url);
                                    setImage(randomSong.image[2].url);
                                    const songName = randomSong.name.length > 15 ? randomSong.name.slice(0, 15) + "..." : randomSong.name;
                                    setName(songName);
                                    setId(randomSong.id);
                                }

                            } catch (error) {
                                console.log(error);
                            }

                        }

                    } catch (error) {
                        console.log(error);
                    }
                }

            } catch (error) {
                console.log(error);
            }
        }

        getArtist();
    }, [track.id]);

    //---------------------------------------------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (audioRef.current && track.url) {
            audioRef.current.src = track.url;
            audioRef.current.play().then(() => setPlayStatus(true)).catch(error => console.log(error));
        }

        async function getLike() {
            try {
                const apiRes = await fetch(`https://api-song-khaki.vercel.app/api/songs`);
                const final = await apiRes.json();

                setLikesong(final);
            } catch (error) {
                console.log(error);
            }
        }

        getLike();
    }, [track]);

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    };

    const previousSong = async () => {
        const currentIndex = playlistHistory.findIndex(song => song.id === track.id);
        const previousIndex = (currentIndex - 1 + playlistHistory.length) % playlistHistory.length;

        console.log(currentIndex);
        console.log(previousIndex);
        const { url, image, name, id } = playlistHistory[previousIndex];

        await playWithoutUpdatingHistory(url);

        setTrack({
            id: id,
            image: image,
            name: name,
            url: url
        });
    };

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    };

    const playNextSong = () => {
        playWithUrl(downloadUrl, image, name, id);
    };

    const seekSong = (e) => {
        audioRef.current.currentTime = (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
    };

    const playWithoutUpdatingHistory = async (url) => {
        if (audioRef.current.src !== url) {
            audioRef.current.src = url;
        }
        await audioRef.current.play();
        setPlayStatus(true);
    };

    const playWithUrl = async (url, image, name, id) => {
        if (audioRef.current.src !== url) {
            audioRef.current.src = url;
        }
        await audioRef.current.play();
        setPlayStatus(true);

        setTrack({
            id: id,
            image: image,
            name: name,
            url: url
        });

        setPlaylistHistory(prev => {
            const updatedHistory = [...prev, {
                id: id,
                image: image,
                name: name,
                url: url
            }];
            console.log('Updated Playlist History:', updatedHistory);
            return updatedHistory;
        });

    };

    const like = async (song_url, song_image, song_name, song_id) => {
        const song = { song_id, song_name, song_url, song_image };

        try {
            const response = await fetch('https://api-song-khaki.vercel.app/api/songs', {
                method: 'POST',
                body: JSON.stringify(song),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();

            } else {
                console.error('Failed to add song:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteSong = async (id) => {

        try {
            const response = await fetch('https://api-song-khaki.vercel.app/api/songs/' + id, {
                method: 'DELETE'
            });

            if (response.ok) {
                const data = await response.json();

            } else {
                console.error('Failed to delete song:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const contextValue = {
        audioRef,
        seekBg,
        seekBar,
        track, setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play,
        pause,
        seekSong,
        playWithUrl,
        playNextSong,
        previousSong,
        like,
        likesong,
        deleteSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
