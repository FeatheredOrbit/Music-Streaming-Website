import { useEffect, useRef, useState } from "react";
import "../../styles/account.css";

const InputChangeType = {
    PFP : "pfp",
    USERNAME : "username",
    EXTRA_INFORMATION : "extra"
}

export default function Account({ onNavigate, transitioning }) {
    const accountPictureInputRef = useRef(null);

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
            console.error('Fetch error:', error);
            throw error;
        }
    }

    useEffect(function() {
        getUserData();
    }, []);

    async function changeAccountPicture(event) {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }

        try {

            const dataToSend = new FormData();
            dataToSend.append("profilePicture", file);

            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/change_profile_picture.php", {
                method: 'POST',
                body: dataToSend
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
                return;
            }

            if (data.pathToProfilePicture) {
                setUserData(prev => ({
                    ...prev,
                    profilePicture: data.profilePicture
                }));

                alert("Profile picture successfully changed! Yippie!")
                return;
            }

        }
        catch (error) {
            console.log("Upload error:", error);
            throw error;
        }
    }

    async function changeExtraInfo() {
        const information = prompt("Insert new information:");

        if (information === null) {
            return;
        }

        try {

            const dataToSend = new FormData();
            dataToSend.append("extraInfo", information);

            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/change_extra_info.php", {
                method: 'POST',
                body: dataToSend
            });

            const data = await response.json();

            if (data.success) {
                setUserData(prev => ({
                    ...prev,
                    extra: information
                }));

                alert("Information successfully changed! Yippie!");
                return;
            }
            else {
                alert("Failed to update information");
                return;
            }

        }
        catch (error) {
            console.log("Upload error:", error);
            throw error;
        }
    }

    async function validatePassword(request) {
    while (true) { 
        let password;
        
        if (request === InputChangeType.PFP) {
            password = prompt("Insert password (Be quick if on firefox or it won't open the file picker):");
        }   
        else {
            password = prompt("Insert password:");
        }

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
                method: 'POST',
                body: dataToSend
            });

            const data = await response.json();

            if (data.notLoggedIn) {
                alert("User is not logged in, back to the home page you go");
                onNavigate("/");
                return;
            }
            
            if (data.passwordResult) {
                if (request === InputChangeType.PFP) {
                    accountPictureInputRef.current.click();
                }
                else if (request === InputChangeType.EXTRA_INFORMATION) {
                    changeExtraInfo();
                }
                return;
            }
            else {
                alert("Password doesn't match");
                continue;
            }

        }
        catch (error) {
            console.error('Fetch error:', error);
            alert("An error occurred. Please try again.");
            return;
        }
    }
}

    return (
        <div>

            <div className="account-container">
                <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={accountPictureInputRef}
                    accept="image/*"
                    onChange={changeAccountPicture}
                />  
                <img 
                    className="account-picture"
                    src={userData.profilePicture ? `api/${userData.profilePicture}` : "assets/shared/buttons/account/default.png"}
                    has_profile_picture={(userData.profilePicture ? true : false).toString()}
                    onClick={() => {validatePassword(InputChangeType.PFP)}}
                />

                <div className="extra-information-container" onClick={() => {validatePassword(InputChangeType.EXTRA_INFORMATION)}}>
                    <p> {userData.extra ? userData.extra : "No information on this user"} </p>
                </div>   
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
                src={userData.profilePicture ? `api/${userData.profilePicture}` : "assets/shared/buttons/account/default.png"}
                onClick={function() { if (!transitioning) { onNavigate(userData.loggedIn ? "/account" : "/signup") }}} />
        </div>
    );
}
