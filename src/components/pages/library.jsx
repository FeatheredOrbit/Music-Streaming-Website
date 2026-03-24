// Library page that displays the user's uploaded songs and liked songs in separate sections.
// Fetches both collections from the server and renders them using the SongCard component.
// Includes a button to navigate to the song posting page for creating new tracks.

import { useEffect, useState } from "react";
import "../../styles/library.css";
import SongCard from "../other/song_card";

export default function Library({ onNavigate, transitioning, playingSongData, setPlayingSongData }) {
    const [userData, setUserData] = useState({
        loggedIn: false,
        username: "",
        profilePicture: ""
    });

    const [userSongs, setUserSongs] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);

    // Retrieves the current user's information for the navigation buttons.
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

    // Fetches songs uploaded by the user.
    async function getUserSongs() {
        try {

            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/get_current_user_songs.php");

            const data = await response.json();

            if (data.error) {
                console.log("Failed to fetch songs");
            }
            if (data.songs) {
                setUserSongs(data.songs);
            }

        }
        catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    }

    // Fetches songs that the user has liked.
    async function getLikedSongs() {
        try {

            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/get_liked_songs.php");

            const data = await response.json();

            if (data.error) {
                console.log("Failed to fetch songs");
            }
            if (data.songs) {
                setLikedSongs(data.songs);
            }

        }
        catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    }

    // Loads all data when the component mounts.
    useEffect(function() {
        getUserData();
        getUserSongs();
        getLikedSongs();
    }, []);

    return (
        <div>

            <img className="button-pillar" src="assets/shared/foreground/button_pillar_shadowless.png" />
            <img className="background" src="assets/shared/background/background.png" />
            <img className="pillars pillar-left" src="assets/shared/background/actual_pillar.png" />
            <img className="pillars pillar-right" src="assets/shared/background/actual_pillar.png" />

            <div className="liked-songs-label">
                <h1> LIKED SONGS </h1>
            </div>
            <div className="liked-songs">
                {
                    !likedSongs.length ? "" :
                    
                    (
                        likedSongs.map(song => (
                            <SongCard 
                                songId={song.songId} 
                                songName={song.songName} 
                                pathToCover={song.pathToCover}
                                setPlayingSongData={setPlayingSongData}
                                playingSongData={playingSongData}
                            />
                        ))
                    )
                }
            </div>

            <div className="posted-songs-label">
                <h1> POSTED SONGS </h1>
            </div>
            <div className="posted-songs">
                {
                    !userSongs.length ? "" :
                    
                    (
                        userSongs.map(song => (
                            <SongCard 
                                songId={song.songId} 
                                songName={song.songName}
                                pathToCover={song.pathToCover}
                                playingSongData={playingSongData}
                                setPlayingSongData={setPlayingSongData}
                            />
                        ))
                    )
                }
            </div>
            <img 
                className="button new-button" 
                src="assets/shared/buttons/new/default.png" 
                title="Post new song"
                onClick={function() { if (!transitioning && userData.loggedIn) { onNavigate("/song-posting") }}}
            />

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