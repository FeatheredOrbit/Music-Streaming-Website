// Signup page that creates new user accounts with username and password.
// Performs a LOT of validation on both client and server sides including password strength,
// special character requirements, capital letters, and matching password confirmation.
// Redirects to the account page after successful account creation.

import { useState, useEffect } from "react";
import "../../styles/signup.css";

export default function Signup({ onNavigate, transitioning }) {
    const [loggedIn, setLoggedIn] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });
    
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        confirmPassword: ""
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

    // Validates all fields before sending to the server. Checks for empty fields,
    // username length limits, password length, special characters, capital letters,
    // and matching confirmation password.
    function validateForm() {
        let isValid = true;
        const newErrors = {
            username: "",
            password: "",
            confirmPassword: ""
        };

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
            isValid = false;
        } else if (formData.username.length > 100) {
            newErrors.username = "Username can't be more than 100 characters";
            isValid = false;
        }

        const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        const capitalLetterRegex = /[A-Z]/;

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
            isValid = false;
        } else if (!specialCharacterRegex.test(formData.password)) {
            newErrors.password = "Password must contain at least one special character";
            isValid = false;
        } else if (!capitalLetterRegex.test(formData.password)) {
            newErrors.password = "Password must contain at least a capital letter";
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Submits the signup data to the server. The server performs additional validation
    // including checking for existing usernames and password constraints.
    async function handleSignup() {
        if (!transitioning && validateForm()) {

            try {
                const dataToSend = new FormData();
                dataToSend.append("username", formData.username);
                dataToSend.append("password", formData.password);
                dataToSend.append("conPassword", formData.confirmPassword);

                const response = await fetch("api/Music-Streaming-Website/back-end/scripts/login-signup/signup.php", {
                    method: "POST",
                    body: dataToSend
                });

                const data = await response.json();
                
                if (data.usernameInvalid) {
                    setErrors(prev => ({
                        ...prev,
                        username: "Username must be between 1 and 100 characters"
                    }));
                } 
                else if (data.passwordInvalid) {
                    setErrors(prev => ({
                        ...prev,
                        password: "Password must be between 8 and 128 characters"
                    }));
                } 
                else if (data.passwordNotSpecial) {
                    setErrors(prev => ({
                        ...prev,
                        password: "Password must contain at least one special character"
                    }));
                }
                else if (data.passwordNotCapital) {
                    setErrors(prev => ({
                        ...prev,
                        password: "Password must contain at least a capital letter"
                    }));
                }  
                else if (data.conPasswordInvalid) {
                    setErrors(prev => ({
                        ...prev,
                        confirmPassword: "Passwords do not match"
                    }));
                } 
                else if (data.usernameExists) {
                    setErrors(prev => ({
                        ...prev,
                        username: "Username already exists"
                    }));
                } 
                else if (data.signupSuccessful) {
                    alert("Signup was successful!");
                    onNavigate("/account");
                } 
                else if (!data.signupSuccessful) {
                    alert("Something went wrong during signup");
                }

            } catch (error) {
                console.error("Signup error:", error);
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
                has_profile_picture={(false).toString()}
                title="Click to set up account" 
                src="assets/shared/buttons/account/default.png" 
                onClick={function() { if (!transitioning) { onNavigate("/signup") }}} 
            />
            <img 
                className="button library-button" 
                src="assets/shared/buttons/library/default.png"
                title="Library"
                is_logged_in={loggedIn.toString()}
                onClick={function() { if (!transitioning && loggedIn) { onNavigate("/library") }}} 
            />

            <div className="signup-container">
                <div className="signup-grid">
                    <h1 className="signup-title">SIGNUP</h1>
                    
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

                    <div className="input-group confirm-password-group">
                        <label className="input-label">CONFIRM PASSWORD</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            className="input-field" 
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                        <div className="error-label">{errors.confirmPassword}</div>
                    </div>

                    <div className="signup-button-container">
                        <button 
                            className="signup-button" 
                            onClick={handleSignup}
                            title="Sign up"
                        >
                        </button>
                    </div>
                </div>
            </div>

            <div className="move-to-login">
                <p> Already have an account? { } 
                    <span 
                    style={{color:"red", textDecoration:"underline"}}
                    onClick={() => {if (!transitioning) {onNavigate("/login")}}}> Click here! </span> 
                </p>
            </div>
        </div>
    );
}