import * as React from "react";
import { useState } from "react";
import "../../styles/signup-login.css";

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

    const handleInputChange = (e) => {
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

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            username: "",
            password: "",
            confirmPassword: ""
        };

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
            isValid = false;
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSignup = () => {
        if (!transitioning && validateForm()) {

            console.log("Signup attempt with:", formData.username);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    };

    return (
        <div>
            <img className="background" src="assets/shared/background/background.png" alt="background" />

            <img className="button-pillar" src="assets/shared/foreground/button_pillar_shadowless.png" alt="button pillar" />

            <img className="pillars pillar-left" src="assets/shared/background/actual_pillar.png" alt="left pillar" />
            <img className="pillars pillar-right" src="assets/shared/background/actual_pillar.png" alt="right pillar" />

            <img 
                className="button home-button" 
                id="home-button" 
                title="Home" 
                src="assets/shared/buttons/home/default.png" 
                alt="home" 
                onClick={function() { if (!transitioning) { onNavigate("/") }}} 
            />
            <img 
                className="button account-button" 
                id="account-button" 
                title="Click to set up account" 
                src="assets/shared/buttons/account/default.png" 
                alt="account" 
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
                            onKeyDown={handleKeyPress}
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
                            onKeyDown={handleKeyPress}
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
                            onKeyDown={handleKeyPress}
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
        </div>
    );
}