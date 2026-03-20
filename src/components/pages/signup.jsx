import { useState } from "react";
import "../../styles/signup.css";

export default function Signup({ onNavigate, transitioning }) {
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

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

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

    async function handleSignup() {
        if (!transitioning && validateForm()) {

            try {
                // Create form data to send.
                const dataToSend = new FormData();
                dataToSend.append('username', formData.username);
                dataToSend.append('password', formData.password);
                dataToSend.append('conPassword', formData.confirmPassword);

                const response = await fetch("api/Music-Streaming-Website/back-end/scripts/login-signup/signup.php", {
                    method: 'POST',
                    body: dataToSend
                });

                const data = await response.json();
                
                // The backend re-validates the data before inserting it into the database.
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
                else if (data.conPasswordInvalid) {
                    setErrors(prev => ({
                        ...prev,
                        confirmPassword: "Passwords do not match, from server"
                    }));
                } 
                else if (data.usernameExists) {
                    setErrors(prev => ({
                        ...prev,
                        username: "Username already exists"
                    }));
                } 
                // If the signup is successful, throw a message and go back to the home page.
                else if (data.signupSuccessful) {
                    alert("Signup was successful!");
                    onNavigate("/");
                } 
                // if the signup isn't successful, throw a message and stay on the page.
                else if (!data.signupSuccessful) {
                    alert("Something went wrong during signup");
                }

            } catch (error) {
                console.error('Signup error:', error);
                throw error;
            }
        }
    };

    return (
        <div>
            <img className="background" src="assets/shared/background/background.png" />

            <img className="button-pillar" src="assets/shared/foreground/button_pillar_shadowless.png" />

            <img className="pillars pillar-left" src="assets/shared/background/actual_pillar.png" />
            <img className="pillars pillar-right" src="assets/shared/background/actual_pillar.png" />

            <img 
                className="button home-button" 
                id="home-button" 
                title="Home" 
                src="assets/shared/buttons/home/default.png" 
                onClick={function() { if (!transitioning) { onNavigate("/") }}} 
            />
            <img 
                className="button account-button" 
                id="account-button" 
                title="Click to set up account" 
                src="assets/shared/buttons/account/default.png" 
                onClick={function() { if (!transitioning) { onNavigate("/signup") }}} 
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
                    onClick={() => {onNavigate("/login")}}> Click here! </span> 
                </p>
            </div>
        </div>
    );
}