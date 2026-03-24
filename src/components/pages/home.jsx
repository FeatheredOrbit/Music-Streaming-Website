import { useEffect, useState } from "react";
import "../../styles/home.css";
import SongCard from "../other/song_card";

export default function Home({ onNavigate, transitioning, playingSongData, setPlayingSongData }) {
    const [userData, setUserData] = useState({
        loggedIn: false,
        username: "",
        profilePicture: ""
    });

    const [songs, setSongs] = useState([]);

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
            console.error('Fetch error:', error);
                throw error;
        }
    }

    async function getAllSongs() {
        try {

            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/get_all_songs.php");

            const data = await response.json();

            if (data.error) {
                console.log("Failed to fetch songs");
            }
            if (data.songs) {
                setSongs(data.songs);
            }

        }
        catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    useEffect(function() {
        getUserData();
        getAllSongs();
    }, []);

    return (
        <div>

            <div className="all-songs-label">
                <h1> ALL SONGS </h1>
            </div>

            <div className="all-songs">
                {
                    !songs.length ? "" : 

                    (
                        songs.map(song => (
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
                is_logged_in={userData.loggedIn.toString()}
                title="Library"
                onClick={function() { if (!transitioning && userData.loggedIn) { onNavigate("/library") }}} 
            />
        </div>
    );
}
