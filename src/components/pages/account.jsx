import { useEffect, useState } from "react";
import "../../styles/account.css";

export default function Account({ onNavigate, transitioning }) {
    const [userData, setUserData] = useState({
        loggedIn: false,
        username: "",
        dateJoined: "",
        extra: "",
        profilePicture: ""
    });

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
                    extra: data.dateExtra
                }));
            }

            if (data.pathToProfilePicture) {
                setUserData(prev => ({
                    ...prev,
                    profilePicture: pathToProfilePicture
                }));
            }
        }
        catch (error) {
            console.error('Fetch error:', error);
                throw error;
        }
    }

    useEffect(function() {
        getUserData();
    }, []);

    return (
        <div>

            <div className="account-container">
                <input
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/*"
                />  
                <img 
                    className="account-picture"
                    src={userData.profilePicture || "assets/shared/buttons/account/default.png"}
                    has_profile_picture={(userData.profilePicture ? true : false).toString()}
                />   
            </div>

            <img className="button-pillar" src="assets/shared/foreground/button_pillar_shadowless.png" />
            <img className="background" src="assets/shared/background/background.png" />
            <img className="pillars pillar-left" src="assets/shared/background/actual_pillar.png" />
            <img className="pillars pillar-right" src="assets/shared/background/actual_pillar.png" />

            <img 
                className="button home-button" 
                id="home-button" title="Home" 
                src="assets/shared/buttons/home/default.png" 
                onClick={function() { if (!transitioning) { onNavigate("/") }}} 
            />
            <img 
                className="button account-button" 
                has_profile_picture={(userData.profilePicture ? true : false).toString()}
                id="account-button" 
                title={userData.loggedIn ? userData.username : "Click to set up account"} 
                src={userData.profilePicture || "assets/shared/buttons/account/default.png"}
                onClick={function() { if (!transitioning) { onNavigate(userData.loggedIn ? "/account" : "/signup") }}} />
        </div>
    );
}
