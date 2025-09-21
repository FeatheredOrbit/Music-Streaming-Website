import * as React from "react";
import "../../styles/signup-login.css";


export default function Signup({ onNavigate, transitioning }) {

    const [username, setUsername] = React.useState({
        value: "",
        valid: false,
        taken: false,
        empty: false
    });

    const [email, setEmail] = React.useState({
        value: "",
        valid: false,
        taken: false,
        empty: false
    });

    const [password, setPassword] = React.useState({
        value: "",
        valid: false,
        empty: false
    }); 

    const [conPassword, setConPassword] = React.useState({
        value: "",
        valid: false,
        empty: false
    });

    // Custom parameter for the button (stands for disabled, I couldn't be bothered adapting it to a button tag)
    var dis = username.taken || !username.valid || email.taken || !email.valid || !password.valid ||  !conPassword.valid;
    
    async function signUp() {
        fetch("api/Website/back-end/scripts/login-signup/signup.php", {
            method: "POST",

            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            body: `username=${encodeURIComponent(username.value)}&email=${encodeURIComponent(email.value)}&password=${encodeURIComponent(password.value)}&conPassword=${encodeURIComponent(conPassword.value)}`

            })
        .then(res => res.json())
        .then(data => {
            if (data.nullParameters) {
                console.log("One or more inputs were null");
            }
            if (data.usernameInvalid) {
                setUsername(prev => ({...prev, valid: false }));
            }
            if (data.usernameExists) {
                setUsername(prev => ({...prev, taken: true }));
            }
            if (data.emailInvalid) {
                setEmail(prev => ({...prev, valid: false}));
            }
            if (data.emailExists) {
                setEmail(prev => ({...prev, taken: true}));
            }
            if (data.passwordInvalid) {
                setPassword(prev => ({...prev, valid: false}));
            }
            if (data.conPasswordInvalid) {
                setConPasswordValid(prev => ({...prev, valid: false}));
            }

            if (data.signupSuccessful) {
                console.log("Successfully signed up");
            } 
            if (data.error) {
                console.log ("Error: ", data.error);
            }
        })
        .catch(error => {
            console.error("Error during signup:", error);
        });

        
    }

    async function validateUsername() {
        let valid = username.value.trim().length > 0 && username.value.trim().length <= 100;

        if (valid) {
            fetch(`api/Website/back-end/scripts/login-signup/validate-info/username.php?username=${encodeURIComponent(username.value.trim())}`)
            .then(res => res.json())
            .then(data => {
                setUsername(prev => ({...prev, valid: valid, taken: data.usernameExists, empty: username.value.trim() === ""}));
            })
            .catch(error => {
                console.log("Error during validation: ", error);
            })
        }

    }

    async function validateEmail() {
        let valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && email.value.trim().length > 0 && email.value.trim().length <= 320;

        if (valid) {
            fetch(`api/Website/back-end/scripts/login-signup/validate-info/email.php?email=${encodeURIComponent(email.value.trim())}`) 
            .then(res => res.json())
            .then(data => {
                setEmail(prev => ({...prev, valid: valid, empty: email.value.trim() === "", taken: data.emailExists}));
            })
            .catch(error => {
                console.log("Error during validation: ", error);
            })
        }
    }

    async function validatePassword() {
        setPassword(prev => ({...prev, valid: password.value.length >= 8 && password.value.length <= 100 && !password.value.includes(" "), empty: password.value.trim() === 0}));
    }

    async function validateConPassword() {
        setConPassword(prev => ({...prev, valid: conPassword.value === password.value && password.valid, empty: conPassword.value.trim() === ""}));
    }

    // Calls validation functions every 1.5 seconds for added functionality
    React.useEffect(function() {
        const interval = setInterval(function() {
            validateUsername();
            validateEmail();
            validatePassword();
            validateConPassword();
        }, 1500);

        return() => {clearInterval(interval);};
    });

    return (
        <div>

            <div className="login-signup-container">

                <img className="chain" src="assets/shared/foreground/chain.png" />
                <img className="base" src="assets/shared/foreground/base.png" />

                <div className="login-signup-content">

                    <p className="filling-text"> Create an account </p>

                    <input maxLength={100} type="text" className="username-input" placeholder="Username" value={ username.value } onChange={function(e) {setUsername(prev => ({...prev, value: e.target.value}))}} valid={username.valid.toString()} onBlur={function() { validateUsername() }} />
                    <p className="feedback username-feedback"> Super sigma ligma </p>

                    <input maxLength={320} type="text" className="email-input" placeholder="Email" value={ email.value } onChange={function(e) {setEmail(prev => ({...prev, value: e.target.value}))}} valid={email.valid.toString()} onBlur={function() { validateEmail() }} />
                    <p className="feedback email-feedback"> Super sigma ligma </p>

                    <input maxLength={128} type="password" className="password-input" placeholder="Password" value={ password.value } onChange={function(e) {setPassword(prev => ({...prev, value: e.target.value}))}} valid={password.valid.toString()} onBlur={function() { validatePassword()}}  />
                    <p className="feedback password-feedback"> Super sigma ligma </p>

                    <input maxLength={128} type="password" className="confirm-password-input" placeholder="Confirm Password" value={ conPassword.value } onChange={function(e) {setConPassword(prev => ({...prev, value: e.target.value}))}} valid={conPassword.valid.toString()} onBlur={function() { validateConPassword()}}  />
                    <p className="feedback confirm-password-feedback"> Super sigma ligma </p>

                    <img className="next-button" src="assets/shared/buttons/next/default.png" onClick={function() { if(!dis) {signUp()}}}
                        dis={dis.toString()}
                    />

                    <p className="move-to-login"> Already have an account? {"\n"} 
                        <span style={{color: "Red", textDecoration: "Underline", fontWeight: "Bold"}} onClick={function() {if (!transitioning) {onNavigate("/login")}}}>
                            Click here.
                        </span>
                    </p>

                </div>

            </div>

            <img className="background" src="assets/shared/background/background.png" />

            <img className="button-pillar" src="assets/shared/foreground/button_pillar_shadowless.png" />

            <img className="pillars pillar-left" src="assets/shared/background/actual_pillar.png" />
            <img className="pillars pillar-right" src="assets/shared/background/actual_pillar.png" />

            <img className="button home-button" id="home-button" title="Home" src="assets/shared/buttons/home/default.png" onClick={function() { if (!transitioning) { onNavigate("/") }}} />
            <img className="button account-button" id="account-button" title="Click to set up account" src="assets/shared/buttons/account/default.png" onClick={function() { if (!transitioning) { onNavigate("/signup") }}} />
        </div>
    );
}
