import * as React from "react";
import * as Router from "react-router-dom";
import useWindowResize from "../utils/useWindowResize";
import "../../styles/home.css";

export default function Home({ onNavigate, transitioning }) {
    useWindowResize();

    return (
        <div>
            <div className="container" id="song-grid" />

            <img className="button-pillar" src="assets/shared/foreground/button_pillar_shadowless.png" />
            <img className="background" src="assets/shared/background/background.png" />
            <img className="pillars pillar-left" src="assets/shared/background/actual_pillar.png" />
            <img className="pillars pillar-right" src="assets/shared/background/actual_pillar.png" />

            <img className="button home-button" id="home-button" title="Home" src="assets/shared/buttons/home/default.png" onClick={function() { if (!transitioning) { onNavigate("/") }}} />
            <img className="button account-button" id="account-button" title="Click to set up account" src="assets/shared/buttons/account/default.png" onClick={function() { if (!transitioning) { onNavigate("/signup") }}} />
        </div>
    );
}
