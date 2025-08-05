import * as React from "react";
import useWindowResize from "../utils/useWindowResize";
import "../../styles/signup-login.css";

export default function Signup({ onNavigate, transitioning }) {
    useWindowResize();

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [conPassword, setConPassword] = React.useState("");

    function signUp() {
        fetch("back-end/scripts/login-signup/signup.php", 
            {
                method: "POST",
                headers: {
                    "Content-Type" : "application/x-www-form-urlencoded"
                },
                body: 'username=${encodeURIcomponent(username)}&password=${encodeURIcomponent(password)}&conPassword=${encodeURIcomponent(conPassword)}'
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

            <div className="login-signup-container">

                <img className="login-signup-pillar" src="assets/shared/foreground/login_signup_pillar.png" />

                <div className="login-signup-content">

                    <p className="filling-text"> Create an account </p>

                    <input type="text" className="username-input" placeholder="Username" value={ username } onChange={function(e) {setUsername(e.target.value)}}  />
                    <input type="text" className="email-input" placeholder="Email" value={ email } onChange={function(e) {setEmail(e.target.value)}}  />
                    <input type="password" className="password-input" placeholder="Password" value={ password } onChange={function(e) {setPassword(e.target.value)}} />
                    <input type="password" className="con-password-input" placeholder="Confirm Password" value={ conPassword } onChange={function(e) {setConPassword(e.target.value)}} />

                    <img src="assets/shared/buttons/next/default.png" className="button next-button" />

                    <p className="move-to-login"> 

                        Have an account already? {""}  

                        <span style={{fontWeight: "bold", color: "blue" }} onClick={function() { if (!transitioning) {  onNavigate("/login")}}}> 

                            Click here. 

                        </span> 
                    </p>

                </div>

            </div>

            <img className="background" src="assets/shared/background/background.png" />

            <img className="pillars pillar-left" src="assets/shared/background/actual_pillar.png" />
            <img className="pillars pillar-right" src="assets/shared/background/actual_pillar.png" />

            <img className="button home-button" id="home-button" title="Home" src="assets/shared/buttons/home/default.png" onClick={function() { if (!transitioning) { onNavigate("/") }}} />
            <img className="button account-button" id="account-button" title="Click to set up account" src="assets/shared/buttons/account/default.png" onClick={function() { if (!transitioning) { onNavigate("/signup") }}} />
        </div>
    );
}
