import { useState, useRef, useEffect } from "react";
import "../../styles/song_overlay.css";

export default function SongOverlay({ playingSongData, setPlayingSongData }) {
    const songRef = useRef(null);
    const [loading, setLoading] = useState(false);
    
    const [songData, setSongData] = useState(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [songTime, setSongTime] = useState("0");
    const [elapsedTime, setElapsedTime] = useState("0");
    const [extraInfoOpen, setExtraInfoOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        if (!playingSongData.songId) {
            setSongData(null);
            return;
        }
        
        fetchSong();

    }, [playingSongData.songId]);

    async function fetchSong() {
            try {

                const dataToSend = new FormData();
                dataToSend.append("songId", playingSongData.songId);

                const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/get_specific_song.php", {
                    method: 'POST',
                    body: dataToSend
                });

                const data = await response.json();
                
                if (data.success) {
                    setSongData(data.song);
                    setIsLiked(data.song.isLiked === 1);
                    setLikeCount(data.song.likeCount);
                }
            } 
            catch (error) {
                console.error("Fetch error:", error);
            }
        }

    useEffect(() => {
        setIsPlaying(false);
        setElapsedTime("0");
        if (songRef.current) {
            songRef.current.currentTime = 0;
            songRef.current.pause();
        }
    }, [playingSongData.songId]);

    function togglePlay() {
        if (!songRef.current) return;

        if (isPlaying) {
            songRef.current.pause();
        } else {
            songRef.current.play();
        }

        setIsPlaying(!isPlaying);
    }

    function formatTime(time) {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    async function likeSong() {
        if (!songData) return;
        
        try {
            const dataToSend = new FormData();
            dataToSend.append("songId", Number(songData.songId));

            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/like_song.php", {
                method: 'POST',
                body: dataToSend
            });

            const data = await response.json();

            if (data.notLoggedIn) {
                alert("User is not logged in");
                return;
            }

            if (data.success) {
                if (data.liked) {
                    setLikeCount(prev => prev + 1);
                    setIsLiked(true);
                } else if (data.unliked) {
                    setLikeCount(prev => prev - 1);
                    setIsLiked(false);
                }
            }
        } catch (error) {
            console.log("Fetch error:", error);
        }
    }

    useEffect(() => {
        return () => {
            if (songRef.current) {
                songRef.current.pause();
                songRef.current.src = "";
            }
        };
    }, []);

    if (!playingSongData.songId) return null;
    if (!songData) return null;

    return (
        <>
            <audio 
                ref={songRef}
                src={`api/${songData.pathToSong}`}
                onTimeUpdate={() => setElapsedTime(songRef.current?.currentTime || 0)}
                onLoadedMetadata={() => setSongTime(songRef.current?.duration || 0)}
            />

            <div className="song-overlay">
                <img className="song-overlay-image" src="assets/shared/foreground/song_overlay.png" alt="overlay" />

                <img 
                    src="assets/shared/buttons/play/default.png" 
                    className={isPlaying ? "pause-button" : "play-button"} 
                    onClick={togglePlay}
                    alt={isPlaying ? "pause" : "play"}
                />

                <input 
                    className="song-overlay-slider" 
                    type="range" 
                    min="0"
                    max={songTime || 0}
                    value={elapsedTime}
                    onChange={(e) => {
                        const time = parseFloat(e.target.value);
                        if (songRef.current) {
                            songRef.current.currentTime = time;
                            setElapsedTime(time);
                        }
                    }}
                />

                <p className="song-time"> {formatTime(songTime)} </p>
                <p className="elapsed-time"> {formatTime(elapsedTime)} </p>
            </div>

            <div className="like-overlay">
                <p className="like-amount"> {likeCount} likes </p>

                <img
                    className="like-button" 
                    src="assets/shared/buttons/like/default.png" 
                    is_liked={isLiked.toString()}
                    onClick={likeSong}
                    alt="like"
                />
            </div>

            <div>
                <img 
                    className={extraInfoOpen ? "show-less-button" : "show-more-button"} 
                    src="assets/shared/buttons/arrow/default.png" 
                    onClick={() => setExtraInfoOpen(!extraInfoOpen)}
                    alt="toggle info"
                />

                {extraInfoOpen && (
                    <div className="song-information-container"> 
                        <img 
                            className="song-overlay-cover" 
                            src={songData.pathToCover ? `api/${songData.pathToCover}` : "assets/shared/icons/main/sizes/main16x16.png"} 
                            alt="cover"
                        />
                        <p className="song-overlay-name">Song Name: {songData.songName}</p>
                        <p className="song-overlay-artist">Artist: {songData.artist}</p>
                        <p className="song-overlay-uploaded-by">Uploaded By: {songData.uploadedByUsername}</p>
                    </div>
                )}
            </div>
        </>
    );
}