import * as React from "react";
import * as Router from "react-router-dom";
import useWindowResize from "../utils/useWindowResize";
import "../../styles/signup.css";

export default function Login({ onNavigate, transitioning }) {
    useWindowResize();

    function signUp(username, password, confirmPassword) {
        fetch("back-end/scripts/login-signup/signup.php", 
            {
                method: "POST",
                headers: {
                    "Content-Type" : "application/x-www-form-urlencoded"
                },
                body: 'username=${encodeURIcomponent(username)}&password=${encodeURIcomponent(password)}&conPassword=${encodeURIcomponent(confirmPassword)}'
            }
        )
        .then(res => res.json())
        .then(data => {
            console.log("Server response:", data);
        })
        .catch(error => {
            console.error("Error during signup:", error);
        });

        
    }


    return (
        <div>

            <img className="login-signup-pillar" src="assets/shared/foreground/login_signup_pillar.png" />

            <img className="background" src="assets/shared/background/background.png" />

            <img className="pillars pillar-left" src="assets/shared/background/actual_pillar.png" />
            <img className="pillars pillar-right" src="assets/shared/background/actual_pillar.png" />

            <p className="move-to-login"> 
                Have an account already? 
                <span style={{fontWeight: "bold"}} onClick={function() { if (!transitioning) {  onNavigate("/login")}}}> 
                    Click here. 
                </span> 
            </p>

            <img className="button home-button" id="home-button" title="Home" src="assets/shared/buttons/home/default.png" onClick={function() { if (!transitioning) { onNavigate("/") }}} />
            <img className="button account-button" id="account-button" title="Click to set up account" src="assets/shared/buttons/account/default.png" onClick={function() { if (!transitioning) { onNavigate("/signup") }}} />
        </div>
    );
}