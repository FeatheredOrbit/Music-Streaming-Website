import { useEffect, useState } from "react";
import "../../styles/song_card.css";

export default function SongCard({
    songId, 
    songName, 
    pathToCover,  
    playingSongData, 
    setPlayingSongData
}) {
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (clicked) {
            setPlayingSongData({
                songId: songId.toString()
            });
        }
    }, [clicked, songId, setPlayingSongData]);

    useEffect(() => { 
    if (playingSongData.songId !== songId.toString()) { 
        setClicked(false); 
    } else if (playingSongData.songId === songId.toString()) { 
        setClicked(true); 
    } 
}, [playingSongData.songId, songId]);

    return (
        <div className="song-card" clicked={(clicked).toString()} onClick={() => {
            if (clicked) {
                setPlayingSongData({ songId: "" });
                setClicked(false);
            } else {
                setClicked(true);
            }
        }}>
            <img 
                className="song-card-cover"
                src={pathToCover ? `api/${pathToCover}` : "assets/shared/icons/main/sizes/main16x16.png"}
                alt={songName}
            />
            <div className="song-card-name"> 
                <p> {songName} </p>
            </div>
        </div>
    );
}