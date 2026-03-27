// Global playback overlay that appears when a song is selected from any page.
// Displays an audio player with play, pause, seek controls, and time indicators.
// Shows song metadata including cover art, title, artist, uploader, and date.
// Allows users to like or unlike songs and delete their own uploaded tracks.
// Password validation is required before deleting a song for security.

import { useState, useRef, useEffect } from "react";
import "../../styles/song_overlay.css";

export default function SongOverlay({onNavigate, playingSongData, setPlayingSongData }) {
    const songRef = useRef(null);
    
    const [songData, setSongData] = useState(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [songTime, setSongTime] = useState("0");
    const [elapsedTime, setElapsedTime] = useState("0");
    const [extraInfoOpen, setExtraInfoOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // Fetches the full song data whenever a new song is selected.
    useEffect(() => {
        if (!playingSongData.songId) {
            setSongData(null);
            return;
        }
        
        fetchSong();

    }, [playingSongData.songId]);

    // Retrieves song details including like count and whether the current user has liked it.
    async function fetchSong() {
            try {

                const dataToSend = new FormData();
                dataToSend.append("songId", playingSongData.songId);

                const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/get_specific_song.php", {
                    method: "POST",
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

    // Resets the audio player when switching between songs.
    useEffect(() => {
        setIsPlaying(false);
        setElapsedTime("0");
        if (songRef.current) {
            songRef.current.currentTime = 0;
            songRef.current.pause();
        }
    }, [playingSongData.songId]);

    // Toggles between playing and pausing the current song.
    function togglePlay() {
        if (!songRef.current) return;

        if (isPlaying) {
            songRef.current.pause();
        } else {
            songRef.current.play();
        }

        setIsPlaying(!isPlaying);
    }

    // Converts seconds into a minutes:seconds format for display.
    function formatTime(time) {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    // Sends a like or unlike request to the server and updates the local state.
    async function likeSong() {
        if (!songData) return;
        
        try {
            const dataToSend = new FormData();
            dataToSend.append("songId", Number(songData.songId));

            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/like_song.php", {
                method: "POST",
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

    // Prompts for password verification before allowing song deletion.
    async function validatePassword() {
        while (true) {

            const password = prompt("Insert password:");
            

            if (password === null) {
                return;
            }

            if (password.trim() === "") {
                alert("Password can't be empty");
                continue;
            }

            try {
                const dataToSend = new FormData();
                dataToSend.append("password", password);

                const response = await fetch("api/Music-Streaming-Website/back-end/scripts/validate/validate_password.php", {
                    method: "POST",
                    body: dataToSend
                });

                const data = await response.json();

                if (data.notLoggedIn) {
                    alert("User is not logged in");
                    onNavigate("/");
                    return;
                }

                if (data.passwordResult) {
                    deleteSong();

                    return;
                }
                else {
                    alert("Password doesn't match");
                    continue;
                }
            }
            catch (error) {
                console.error("Fetch error:", error);
                alert("An error occurred. Please try again.");
                return;
            }
        }
    }

    // Deletes the current song after ownership verification.
    async function deleteSong() {
        const response = confirm("Are you sure you want to delete the song? This action cannot be undone");

        if (!response) {return; }

        try {
            const dataToSend = new FormData();
            dataToSend.append("songId", playingSongData.songId);

            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/delete_song.php", {
                method: "POST",
                body: dataToSend
            });

            const data = await response.json();

            if (data.notLoggedIn) {
                alert("User is not logged in");
                return;
            }

            if (data.notOwner) {
                alert("You are not the uploader of the song");
                return;
            }

            if (data.error) {
                alert("Failed to delete song");
            }

            if (data.success) {
                alert("Song deleted succesfully, enjoy not listening to your song");
                setPlayingSongData(prev => ({
                    ...prev,
                    songId: ""
                }));

                onNavigate("/account");
            }
        }
        catch (error) {
            console.log("Fetch error:", error);
        }
    }

    // Cleans up the audio element when the overlay unmounts to prevent memory leaks (the tab kept crashing).
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
                <img className="song-overlay-image" src={"assets/shared/foreground/song_overlay.png"} />

                <img 
                    src="assets/shared/buttons/play/default.png" 
                    className={isPlaying ? "pause-button" : "play-button"} 
                    onClick={togglePlay}
                    title={isPlaying ? "Pause" : "Play"}
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

                <img 
                    className="delete-button"
                    src="assets/shared/buttons/delete/default.png" 
                    title="Delete Song"
                    onClick={validatePassword}
                />
            </div>

            <div className="like-overlay">
                <p className="like-amount"> {likeCount} likes </p>

                <img
                    className="like-button" 
                    src="assets/shared/buttons/like/default.png" 
                    is_liked={isLiked.toString()}
                    onClick={likeSong}
                    title={isLiked ? "Unlike" : "Like"}
                />
            </div>

            <div>
                <img 
                    className={extraInfoOpen ? "show-less-button" : "show-more-button"} 
                    src="assets/shared/buttons/arrow/default.png" 
                    onClick={() => setExtraInfoOpen(!extraInfoOpen)}
                    title={!extraInfoOpen ? "Show More Info" : "Show Less Info"}
                />

                {extraInfoOpen && (
                    <div className="song-information-container"> 
                        <img 
                            className="song-overlay-cover" 
                            src={songData.pathToCover ? `api/${songData.pathToCover}` : "assets/shared/icons/main/sizes/main16x16.png"} 
                            
                        />
                        <p className="song-overlay-name">Song Name: {songData.songName}</p>
                        <p className="song-overlay-artist">Artist: {songData.artist}</p>
                        <p className="song-overlay-uploaded-by">Uploaded By: {songData.uploadedByUsername}</p>
                        <p className="song-overlay-date-posted"> Date Posted: {songData.datePosted} </p>
                    </div>
                )}
            </div>
        </>
    );
}