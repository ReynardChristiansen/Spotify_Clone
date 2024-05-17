import { createContext, useRef, useState, useEffect } from "react";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    const [playlistHistory, setPlaylistHistory] = useState([]);

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
            audioRef.current.volume = 0.2;
        }
    }, [downloadUrl, image, name, id]);

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

        getArtist();

    }, [track.id]);

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    };

    const previousSong = () => {
        const currentIndex = playlistHistory.findIndex(song => song.id === track.id);
        const previousIndex = (currentIndex - 1 + playlistHistory.length) % playlistHistory.length;

        const { url, image, name, id } = playlistHistory[previousIndex];

        playWithUrl(url, image, name, id);
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

    const playWithUrl = async (url, image, name, id) => {
        audioRef.current.src = url;
        await audioRef.current.play();
        setPlayStatus(true);

        setTrack({
            id: id,
            image: image,
            name: name,
            url: url
        });

        setPlaylistHistory(prev => [...prev, {
            id: id,
            image: image,
            name: name,
            url: url
        }]);
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
        previousSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
