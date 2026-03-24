// Song posting page that allows users to upload new tracks with metadata.
// Users can optionally add a cover image, specify the song name, artist name,
// and select the audio file. All fields are validated before submission.
// After successful upload, the user is redirected to the library page.

import { useEffect, useRef, useState } from "react";
import "../../styles/song_posting.css";

export default function SongPosting({ onNavigate, transitioning }) {
    const songCoverInputRef = useRef(null);

    const [songCoverUrl, setSongCoverUrl] = useState(null);

    const [userData, setUserData] = useState({
        loggedIn: false,
        username: "",
        dateJoined: "",
        extra: "",
        profilePicture: ""
    });

    const [songData, setSongData] = useState({
        songName: "",
        artist: "",
        songFile: null,
        coverFile: null
   });

    // Fetches current user data to display the navigation buttons correctly.
    async function getUserData() {
        try {
            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/get_user_data.php");

            const data = await response.json();

            if (data.notLoggedIn) {
                setUserData(prev => ({
                    ...prev,
                    loggedIn: false
                }));
                return;
            } else {
                setUserData(prev => ({
                    ...prev,
                    loggedIn: true
                }));
            }

            if (data.username) {
                setUserData(prev => ({
                    ...prev,
                    username: data.username
                }));
            }

            if (data.dateJoined) {
                setUserData(prev => ({
                    ...prev,
                    dateJoined: data.dateJoined
                }));
            }

            if (data.extra) {
                setUserData(prev => ({
                    ...prev,
                    extra: data.extra
                }));
            }

            if (data.pathToProfilePicture) {
                setUserData(prev => ({
                    ...prev,
                    profilePicture: data.pathToProfilePicture
                }));
            }
        }
        catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    }

    // Loads user data when the component mounts.
    useEffect(function() {
        getUserData();
    }, []);

    // Handles cover image selection with file type and size validation.
    // Creates a preview URL to render it immediately for the nice feedback.
    function changeCoverImage(event) {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }

        setSongCoverUrl(URL.createObjectURL(file));

        setSongData(prev => ({
            ...prev,
            coverFile: file
        }));
    }

    // Prompts the user for a song name and validates it.
    function changeSongName() {
        while (true) {
            const name = prompt("Insert song name:");

            if (name === null) {
                return;
            }

            if (name.trim().length === 0) {
                alert("Song name can't be empty");
                continue;
            }

            setSongData(prev => ({
                ...prev,
                songName: name
            }));

            return;
        }
    }

    // Prompts the user for an artist name and validates it.
    function changeArtistName() {
        while (true) {
            const artist = prompt("Insert artist name:");

            if (artist === null) {
                return;
            }

            if (artist.trim().length === 0) {
                alert("Song name can't be empty");
                continue;
            }

            setSongData(prev => ({
                ...prev,
                artist: artist
            }));

            return;
        }
    }

    // Handles audio file selection with file type validation.
    function changeSongFile(event) {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("audio/")) {
            alert("Please select an audio file");
            return;
        }

        setSongData(prev => ({
            ...prev,
            songFile: file
        }));
    }

    // Validates all fields and submits the song data to the server.
    // The server handles file uploads and database insertion.
    async function postSong() {
        if (!songData.songName) {
            alert("You must input a name for the song");
            return;
        }
        else if (!songData.artist) {
            alert("You must input an artist for the song");
            return;
        }
        else if (!songData.songFile) {
            alert("You must select a song file (duh)");
            return;
        }

        try {

            const dataToSend = new FormData();
            dataToSend.append("songName", songData.songName);
            dataToSend.append("artist", songData.artist);
            dataToSend.append("songFile", songData.songFile);

            if (songData.coverFile) {
                dataToSend.append("coverFile", songData.coverFile);
            }

            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/upload_song.php", {
                method: "POST",
                body: dataToSend
            });

            const data = await response.json();

            if (data.nullParameters) {
                alert("Oops, seems like some field might not filled in ... fill it NOW!");
                return;
            }
            if (data.emptySongName) {
                alert("You must input a name for the song");
                return;
            }
            if (data.emptyArtistName) {
                alert("You must input an artist for the song");
                return;
            }
            if (data.noSongFile) {
                alert("You must select a song file (duh)");
                return;
            }
            if (data.songUploadError) {
                alert("Song failed to upload");
                return;
            }
            if (data.coverUploadError) {
                alert("Failed to upload cover");
                return;
            }
            if (data.coverTooLarge) {
                alert("The cover is too large!");
                return;
            }
            if (data.notLoggedIn) {
                alert("The user is not logged in, back to the home page you go!");
                onNavigate("/");
            }
            if (data.uploadFailed) {
                alert("Failed to upload files");
                return;
            }
            if (data.success) {
                alert("Song upload successfully, yippie!");
                onNavigate("/library");
            }
 
        }
        catch (error) {
            console.log("Upload error:", error);
            throw error;
        }
    }

    return (
        <div>
            <div className="song-post-container">
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={songCoverInputRef}
                    onChange={changeCoverImage}
                />  
                <img 
                    className="song-cover"
                    src={songCoverUrl ? songCoverUrl : "assets/shared/icons/main/sizes/main16x16.png"}
                    has_profile_picture={(userData.profilePicture ? true : false).toString()}
                    onClick={() => {songCoverInputRef.current.click()}}
                />

                <div className="select-song-label">
                    <p> SELECT A SONG </p>
                </div>
                <input 
                    type="file" 
                    accept="audio/*"
                    className="song-audio-input"
                    onChange={changeSongFile}
                />

                <div className="song-name-container" onClick={changeSongName}>
                    <p> {songData.songName ? `Song name: ${songData.songName}` : "No inputted song name"} </p>
                </div>

                <div className="artist-container" onClick={changeArtistName}>
                    <p> {songData.artist ? `Artist name: ${songData.artist}` : "No inputted artist name"} </p>
                </div>

                <img 
                    className="button post-button"
                    src="assets/shared/buttons/post/default.png" 
                    title="Post Song" 
                    onClick={postSong}
                />

            </div>

            <img className="button-pillar" src="assets/shared/foreground/button_pillar_shadowless.png" />
            <img className="background" src="assets/shared/background/background.png" />
            <img className="pillars pillar-left" src="assets/shared/background/actual_pillar.png" />
            <img className="pillars pillar-right" src="assets/shared/background/actual_pillar.png" />

            <img 
                className="button home-button" 
                title="Home" 
                src="assets/shared/buttons/home/default.png" 
                onClick={function() { if (!transitioning) { onNavigate("/") }}} 
            />
            <img 
                className="button account-button" 
                has_profile_picture={(userData.profilePicture ? true : false).toString()} 
                title={userData.loggedIn ? userData.username : "Click to set up account"} 
                src={userData.profilePicture ? `api/${userData.profilePicture}` : "assets/shared/buttons/account/default.png"}
                onClick={function() { if (!transitioning) { onNavigate(userData.loggedIn ? "/account" : "/signup") }}} 
            />
            <img 
                className="button library-button" 
                src="assets/shared/buttons/library/default.png"
                title="Library"
                is_logged_in={userData.loggedIn.toString()}
                onClick={function() { if (!transitioning && userData.loggedIn) { onNavigate("/library") }}} 
            />
        </div>
    );
}