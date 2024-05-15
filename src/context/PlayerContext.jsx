import { createContext, useRef, useState, useEffect } from "react";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [track, setTrack] = useState({});
    const [playStatus, setPlayStatus] = useState(false);
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
            }
        };

        audioRef.current.ontimeupdate = updateSeekBar;

        if (audioRef.current) {
            audioRef.current.volume = 0.2;
        }
    }, []);

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    };

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
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
        }
            
        )
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
        
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
