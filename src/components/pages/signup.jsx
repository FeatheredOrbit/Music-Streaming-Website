import * as React from "react";
import useWindowResize from "../utils/useWindowResize";
import "../../styles/signup-login.css";


export default function Signup({ onNavigate, transitioning }) {
    useWindowResize();

    const [username, setUsername] = React.useState(""); // Actual username
    const [usernameTaken, setUsernameTaken] = React.useState(false); // If the username is already in the database
    const [usernameValid, setUsernameValid] = React.useState(false); // If the username is within length limits

    const [email, setEmail] = React.useState(""); // Actual email
    const [emailTaken, setEmailTaken] = React.useState(false); // If the email is already in the database
    const [emailValid, setEmailValid] = React.useState(false); // If the email follows correct email format

    const [password, setPassword] = React.useState(""); // Actual password
    const [passwordValid, setPasswordValid] = React.useState(false); // If the password falls within length limits

    const [conPassword, setConPassword] = React.useState(""); // Confirmation password
    const [conPasswordValid, setConPasswordValid] = React.useState(false); // If the confirm password matches the password

    // Custom parameter for the button (stands for disabled, I couldn't be bothered adapting it to a button tag)
    var dis = usernameTaken || !usernameValid || emailTaken || !emailValid || !passwordValid ||  !conPasswordValid;
    
    async function signUp() {
        fetch("api/Website/back-end/scripts/login-signup/signup.php", {
            method: "POST",

            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&conPassword=${encodeURIComponent(conPassword)}`

            })
        .then(res => res.text())
        .then(data => {
            console.log("Server response:", data);
        })
        .catch(error => {
            console.error("Error during signup:", error);
        });

        
    }

    async function validateUsername() {
        if (username.trim().length <= 100 && username.trim().length > 0) {
            setUsernameValid(true);

            fetch(`api/Website/back-end/scripts/login-signup/validate-info/username.php?username=${encodeURIComponent(username.trim())}`)
            .then(res => res.json())
            .then(data => {
                if (data.usernameExists) {
                    setUsernameTaken(true);
                    console.log("Username taken");
                
                } else {
                    setUsernameTaken(false);
                    console.log("Username NOT taken");
                }
            })
            .catch(error => {
                console.log("Error during validation: ", error);
            })

        } else {
            setUsernameValid(false);
        }
    }

    async function validateEmail() {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (re.test(email.trim()) === true) {
            setEmailValid(true);

            fetch(`api/Website/back-end/scripts/login-signup/validate-info/email.php?email=${encodeURIComponent(email.trim())}`) 
            .then(res => res.json())
            .then(data => {
                if (data.emailExists) {
                    setEmailTaken(true);
                    console.log("Email taken");
                
                } else {
                    setEmailTaken(false);
                    console.log("Email NOT taken");
                }
            })
            .catch(error => {
                console.log("Error during validation: ", error);
            })

        } else {
            setEmailValid(false);
        }

        console.log(re.test(email.trim()));
    }

    async function validatePassword() {
        if (password.trim().length >= 8 && password.trim().length <= 100) {
            setPasswordValid(true);
        } else {
            setPasswordValid(false);
        }
    }

    async function validateConPassword() {
        if (conPassword.trim() === password.trim()) {
            setConPasswordValid(true);
        } else {
            setConPasswordValid(false);
        }
    }

    // Calls validation functions every 6 seconds for added functionality
    React.useEffect(function() {
        const interval = setInterval(function() {
            validateUsername();
            validateEmail();
            validatePassword();
            validateConPassword();
        }, 6000);

        return() => {clearInterval(interval);};
    });


    return (
        <div>

            <div className="login-signup-container">

                <img className="chain" src="assets/shared/foreground/chain.png" />
                <img className="base" src="assets/shared/foreground/base.png" />
                
                <div className="login-signup-content">

                    <p className="filling-text"> Create an account </p>

                    <input maxLength={100} type="text" className="username-input" placeholder="Username" value={ username } onChange={function(e) {setUsername(e.target.value)}} onBlur={function() { validateUsername() }} />
                    <input maxLength={100} type="text" className="email-input" placeholder="Email" value={ email } onChange={function(e) {setEmail(e.target.value)}} onBlur={function() { validateEmail() }} />
                    <input maxLength={128} type="password" className="password-input" placeholder="Password" value={ password } onChange={function(e) {setPassword(e.target.value)}} onBlur={function() { validatePassword()}}  />
                    <input maxLength={128} type="password" className="confirm-password-input" placeholder="Confirm Password" value={ conPassword } onChange={function(e) {setConPassword(e.target.value)}} onBlur={function() { validateConPassword()}}  />

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
