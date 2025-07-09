import * as React from "react";
import * as Router from "react-router-dom";
import useWindowResize from "../utils/useWindowResize";
import useIntroRecache from "../utils/useIntroRecache";
import "../../styles/signup.css";

export default function Signup({ onNavigate }) {
    useWindowResize();

    const navigate = Router.useNavigate();
    const location = Router.useLocation();

    const { introRef, introShadowlessRef, reverseIntroRef, reverseIntroShadowlessRef } = useIntroRecache(); 

    function pageChange(path) {
        if (location.pathname === path) {
            return;
        }

        if (reverseIntroRef.current) { 
            reverseIntroRef.current.offsetHeight;
            reverseIntroRef.current.src = "assets/shared/foreground/intro_reversed.gif?t=" + Date.now();
        }

        if (reverseIntroShadowlessRef.current) {
            reverseIntroShadowlessRef.current.offsetHeight;
            reverseIntroShadowlessRef.current.src = "assets/shared/foreground/intro_reversed_shadowless.gif?t=" + Date.now();
        }

        setTimeout(function() {
            navigate(path);

        }, 2000);
    }

    const [ loading, setLoading ] = React.useState(true);
    
        React.useEffect(function() {
            setTimeout(function() {setLoading(false);}, 300);
    
            clearTimeout();
        });


    return (
        <div style={{"visibility": loading ? "hidden" : "visible"}}>

            <img className="login-signup-pillar" src="assets/shared/foreground/login_signup_pillar.png" />

            <img className="background" src="assets/shared/background/background.png" />

            <img className="pillars pillar-left" src="assets/shared/background/actual_pillar.png" />
            <img className="pillars pillar-right" src="assets/shared/background/actual_pillar.png" />

            <img className="button home-button" id="home-button" title="Home" src="assets/shared/buttons/home/default.png" onClick={function() {onNavigate("/")}} />
            <img className="button account-button" id="account-button" title="Click to set up account" src="assets/shared/buttons/account/default.png" onClick={function() {onNavigate("/signup")}} />
        </div>
    );
}
