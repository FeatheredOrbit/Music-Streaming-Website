// Login page that authenticates users with username and password credentials.
// Validates input fields locally before sending to the server for verification.
// Redirects to the account page upon successful login.

import { useEffect, useState } from "react";
import "../../styles/login.css";

export default function Login({ onNavigate, transitioning }) {
    const [loggedIn, setLoggedIn] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    
    const [errors, setErrors] = useState({
        username: "",
        password: ""
    });

    // Updates form state when the user types in any input field.
    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clears the error message for the field being edited.
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    // Checks that both username and password fields have been filled.
    function validateForm() {
        let isValid = true;
        const newErrors = {
            username: "",
            password: ""
        };

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Submits the login credentials to the server for verification.
    async function handleLogin() {
        if (!transitioning && validateForm()) {

            try {
                const dataToSend = new FormData();
                dataToSend.append("username", formData.username);
                dataToSend.append("password", formData.password);

                const response = await fetch("api/Music-Streaming-Website/back-end/scripts/login-signup/login.php", {
                    method: "POST",
                    body: dataToSend
                });

                const data = await response.json();

                if (data.usernameError) {
                    setErrors(prev => ({
                        ...prev,
                        username: "Username doesn't exist"
                    }));
                } 
                else if (data.passwordError) {
                    setErrors(prev => ({
                        ...prev,
                        password: "Password doesn't match"
                    }));
                } 
                else if (data.loginSuccessful) {
                    alert("Login was successful!");
                    onNavigate("/account");
                }
                else if (!data.loginSuccessful) {
                    alert("Something went wrong with the login");
                }
                

            } catch (error) {
                console.error("Login error:", error);
                throw error;
            }
        }
    };

    // Checks if the user is already logged in to update the library button state.
    async function checkLogStatus() {
        try {
            const response = await fetch("api/Music-Streaming-Website/back-end/scripts/session/get_user_data.php");

            const data = await response.json();

            if (data.notLoggedIn) {
                setLoggedIn(false);
                return;

            } else {
                setLoggedIn(true);
                return;
            }
        }
        catch (error) {
            console.log("Couldn't fetch data", error);
            throw error;
        }
    }

    // Runs once when the component mounts to check login status.
    useEffect(function() {
        checkLogStatus();
    }, []);

    return (
        <div>
            <img className="background" src="assets/shared/background/background.png" />

            <img className="button-pillar" src="assets/shared/foreground/button_pillar_shadowless.png" />

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
                has_pfp={(false).toString()}
                title="Click to set up account" 
                src="assets/shared/buttons/account/default.png" 
                onClick={function() { if (!transitioning) { onNavigate("/login") }}} 
            />
            <img 
                className="button library-button" 
                src="assets/shared/buttons/library/default.png"
                is_logged_in={loggedIn.toString()}
                title="Library"
                onClick={function() { if (!transitioning && loggedIn) { onNavigate("/library") }}} 
            />

            <div className="login-container">
                <div className="login-grid">
                    <h1 className="login-title">LOGIN</h1>
                    
                    <div className="input-group username-group">
                        <label className="input-label">USERNAME</label>
                        <input 
                            type="text" 
                            name="username"
                            className="input-field" 
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                        <div className="error-label">{errors.username}</div>
                    </div>

                    <div className="input-group password-group">
                        <label className="input-label">PASSWORD</label>
                        <input 
                            type="password" 
                            name="password"
                            className="input-field" 
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <div className="error-label">{errors.password}</div>
                    </div>

                    <div className="login-button-container">
                        <button 
                            className="login-button" 
                            onClick={handleLogin}
                            title="Sign up"
                        >
                        </button>
                    </div>
                </div>
            </div>

            <div className="move-to-signup">
                <p> Don't have an account? { } 
                    <span 
                    style={{color:"red", textDecoration:"underline"}}
                    onClick={() => {if (!transitioning) {onNavigate("/signup")}}}> Click here! </span> 
                </p>
            </div>
        </div>
    );
}