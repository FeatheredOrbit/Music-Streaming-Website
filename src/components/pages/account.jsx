// Account page that displays and manages user profile information.
// Users can view their username, join date, extra information, and profile picture.
// You can change almost anything by clicking on any editable field, but not before a password validation prompt.
// Dedicated buttons are provided for changing password, logging out, and deleting the account.

import { useEffect, useRef, useState } from "react";
import "../../styles/account.css";

// Defines the different types of actions that require password validation, this way I don't need multiple password validation functions.
const InputChangeType = {
    PFP : "pfp",
    USERNAME : "username",
    EXTRA_INFORMATION : "extra",
    PASSWORD : "password",
    DELETE_ACCOUNT: "delete"
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

    // Fetches current user data from the server and updates the state.
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

    // Loads user data when the component first mounts.
    useEffect(function() {
        getUserData();
    }, []);

    // Handles profile picture upload. Validates file type and size before sending to the server.
    async function changeAccountPicture(event) {
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

        try {

            const dataToSend = new FormData();
            dataToSend.append("profilePicture", file);

            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/change_profile_picture.php", {
                method: "POST",
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

    // Changes the username after validating input. Uses a loop to handle multiple attempts at validation.
    async function changeUsername() {
        while (true) {
            const username = prompt("Please insert new username:");

            if (username === null) {
                return;
            }

            if (username.trim().length === 0) {
                alert("Username is required");
                continue;

            } else if (username.trim().length > 100) {
                alert("Username can't be more than 100 characters");
                continue;
            }

            try {

                const dataToSend = new FormData();
                dataToSend.append("username", username);

                const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/change_username.php", {
                    method: "POST",
                    body: dataToSend
                });

                const data = await response.json();

                if (data.emptyUsername) {
                    alert("Username is required");
                    continue;

                } else if (data.usernameInvalid) {
                    alert("Username must be between 1 and 100 characters");
                    continue;

                } else if (data.notLoggedIn) {
                    alert("User is not logged in, back to the home page you go");
                    onNavigate("/");
                    return;

                } else if (data.usernameTaken) {
                    alert("Username already exists");
                    continue;

                } else if (data.error) {
                    alert("An error occurred");
                    return;

                }

                if (data.success) {
                    alert("Username successfully changed! Yippie!");
                    setUserData(prev => ({
                        ...prev,
                        username: username
                    }));
                    return;

                } else {
                    alert("An error occurred");
                    return;
                }

            }
            catch (error) {
                console.log("Upload error:", error);
                alert("An error occurred. Please try again.");
                throw error;
            }

        }
    }

    // Updates the extra information field for the user profile.
    async function changeExtraInfo() {
        const information = prompt("Insert new bio:");

        if (information === null) {
            return;
        }

        try {

            const dataToSend = new FormData();
            dataToSend.append("extraInfo", information);

            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/change_extra_info.php", {
                method: "POST",
                body: dataToSend
            });

            const data = await response.json();

            if (data.success) {
                setUserData(prev => ({
                    ...prev,
                    extra: information
                }));

                alert("Bio successfully changed! Yippie!");
                return;
            }
            else {
                alert("Failed to update bio");
                return;
            }

        }
        catch (error) {
            console.log("Upload error:", error);
            throw error;
        }
    }

    // Changes the user password with all required validation, that being password length and complexity.
    async function changePassword() {
        while (true) {
            const password = prompt("Insert new password:");

            const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            const capitalLetterRegex = /[A-Z]/;

            if (password === null) {
                return;
            }

            if (!password) {
                alert("Password is required");
                continue;

            } else if (password.length < 8) {
                alert("Password must be at least 8 characters");
                continue;

            } else if (!specialCharacterRegex.test(password)) {
                alert("Password must contain at least one special character");
                continue;

            } else if (!capitalLetterRegex.test(password)) {
                alert("Password must contain at least a capital letter");
                continue;
            }

            try {

                const dataToSend = new FormData();
                dataToSend.append("password", password);

                const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/change_password.php", {
                    method: "POST",
                    body: dataToSend
                });

                const data = await response.json();

                if (data.emptyPassword) {
                    alert("Password can't be empty");
                    continue;
                }
                else if (data.passwordInvalid) {
                    alert("Password must be between 8 and 128 characters");
                    continue;
                }
                else if (data.passwordNotSpecial) {
                    alert("Password must contain at least one special character");
                    continue;
                }
                else if (data.passwordNotCapital) {
                    alert("Password must contain at least a capital letter");
                    continue;
                }

                if (data.success) {
                    alert("Password successfully changed! Yippie!");
                    return;
                }
                else {
                    alert("Failed to update password");
                    return;
                }
            }
            catch (error) {
                console.log("Upload error:", error);
                throw error;
            }
        }
    }

    // Verifies the user password before allowing any editing of the user account, or worse ... deletion.
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
                    method: "POST",
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
                    else if (request === InputChangeType.USERNAME) {
                        changeUsername();
                    }
                    else if (request === InputChangeType.PASSWORD) {
                        changePassword();
                    }
                    else if (request === InputChangeType.DELETE_ACCOUNT) {
                        deleteAccount();
                    }

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

    // Ends the user session and redirects to the home page.
    async function logOutClicked() {
        const message = confirm("Are you sure you want to log out?");

        if (!message) {return;}

        try {

            await fetch("api/Music-Streaming-Website/back-end/scripts/session/log_out.php");
            onNavigate("/");

            return;

        }
        catch (error) {
            console.log("Logout error:", error);
            throw error;
        }
    }

    // Permanently removes the user account and all associated data.
    async function deleteAccount() {
        const response = confirm("Are you sure you want to delete your account? This action cannot be undone");

        if (!response) {return};

        try {
            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/delete_user.php");

            const data = await response.json();

            if (data.notLoggedIn) {
                alert("The user is not logged in, back to the home page you go!");
                onNavigate("/");
            }

            if (data.success) {
                alert("Account succesfully deleted! enjoy not having an account");
                onNavigate("/");
            }
            else {
                alert("Failed to delete account");
                return;
            }
        }
        catch (error) {
            console.log("Fetch error:", error);
        }
    }

    return (
        <div>
            <div className="account-container">
                <input
                    type="file"
                    style={{ display: "none" }}
                    ref={accountPictureInputRef}
                    accept="image/*"
                    onChange={changeAccountPicture}
                />  
                <img 
                    className="account-picture"
                    src={userData.profilePicture ? `api/${userData.profilePicture}` : "assets/shared/buttons/account/default.png"}
                    has_pfp={(userData.profilePicture ? true : false).toString()}
                    onClick={() => {if (transitioning) {return;} validatePassword(InputChangeType.PFP)}}
                />

                <div className="date-joined-container">
                    <p> {userData.loggedIn ? `Joined: ${userData.dateJoined}` : ""} </p>
                </div>

                <div className="username-container" onClick={() => {if (transitioning) {return;} validatePassword(InputChangeType.USERNAME)}}>
                    <p> {userData.loggedIn ? userData.username : "User is not logged in"} </p>
                </div>

                <div className="extra-information-container" onClick={() => {if (transitioning) {return;} validatePassword(InputChangeType.EXTRA_INFORMATION)}}>
                    <p> {userData.extra ? userData.extra : "This user has no bio"} </p>
                </div>  

                <img 
                    className="button change-password-button" 
                    src="assets/shared/buttons/change_password/default.png" 
                    title="Change Password" 
                    onClick={() => {if (transitioning) {return;} validatePassword(InputChangeType.PASSWORD)}}
                /> 

                <img 
                    className="button log-out-button" 
                    src="assets/shared/buttons/log_out/default.png" 
                    title="Log Out" 
                    onClick={() => {if (transitioning) {return;} logOutClicked()}}
                />
                <img 
                    className="button delete-account-button" 
                    src="assets/shared/buttons/delete/default.png" 
                    title="Delete Account" 
                    onClick={() => {if (transitioning) {return;} validatePassword(InputChangeType.DELETE_ACCOUNT)}}
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
                has_pfp={(userData.profilePicture ? true : false).toString()} 
                title={userData.loggedIn ? userData.username : "Click to set up account"} 
                src={userData.profilePicture ? `api/${userData.profilePicture}` : "assets/shared/buttons/account/default.png"}
                onClick={function() { if (!transitioning) { onNavigate(userData.loggedIn ? "/account" : "/login") }}} 
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