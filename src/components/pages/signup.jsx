import * as React from "react";
import * as Router from "react-router-dom";
import useWindowResize from "../utils/useWindowResize";
import "../../styles/signup.css";

export default function Signup({ onNavigate }) {
    useWindowResize();

    return (
        <div>

            <img className="login-signup-pillar" src="assets/shared/foreground/login_signup_pillar.png" />

            <img className="background" src="assets/shared/background/background.png" />

            <img className="pillars pillar-left" src="assets/shared/background/actual_pillar.png" />
            <img className="pillars pillar-right" src="assets/shared/background/actual_pillar.png" />

            <img className="button home-button" id="home-button" title="Home" src="assets/shared/buttons/home/default.png" onClick={function() {onNavigate("/")}} />
            <img className="button account-button" id="account-button" title="Click to set up account" src="assets/shared/buttons/account/default.png" onClick={function() {onNavigate("/signup")}} />
        </div>
    );
}
