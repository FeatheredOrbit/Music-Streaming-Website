// Reusable card component that displays a song with its cover image and title.
// Clicking the card opens the global playback overlay by updating the parent state.
// Only the song ID is passed to the overlay, which then fetches the full song data.
// The card maintains a highlighted state when its song is currently playing.

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

    // When this card is clicked, send only the song ID to the parent.
    // The overlay component will fetch the full song data separately.
    useEffect(() => {
        if (clicked) {
            setPlayingSongData({
                songId: songId.toString()
            });
        }
    }, [clicked, songId, setPlayingSongData]);

    // Keeps the card's highlight state in sync with the currently playing song.
    // If another song is selected, this card un-highlights automatically.
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
                // Close the overlay by clearing the song ID.
                setPlayingSongData({ songId: "" });
                setClicked(false);
            } else {
                // Open the overlay for this song.
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