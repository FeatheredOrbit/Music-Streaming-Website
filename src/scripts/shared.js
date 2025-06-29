function windowResize() {
    document.documentElement.style.setProperty("--window-width", window.innerWidth + "px");
    document.documentElement.style.setProperty("--window-height", window.innerHeight + "px");

    document.documentElement.style.setProperty("--webpage-width", document.documentElement.scrollWidth + "px");
    document.documentElement.style.setProperty("--webpage-height", document.documentElement.scrollHeight + "px");
}

function pageChange() {
    const intro = document.getElementById("intro_reversed");
    const intro_shadowless = document.getElementById("intro-shadowless_reversed");

    intro.src = "";
    intro_shadowless.src = "";

    intro.offsetHeight;
    intro_shadowless.offsetHeight; 
    
    intro.src = "../../../assets/shared/foreground/intro_reversed.gif?t=" + Date.now();
    intro_shadowless.src = "../../assets/shared/foreground/intro_reversed_shadowless.gif?t=" + Date.now();
}

function homeClick() {
    pageChange();

    setTimeout(function() {
        window.location = "home-page.html"
    }, 2000);
}

function accountClick() {
    pageChange();

    setTimeout(function() {
        window.location = "signin-login.html"
    }, 2000)
}


windowResize();

window.addEventListener("resize", windowResize);

document.getElementById("home-button").addEventListener("click", homeClick);
document.getElementById("account-button").addEventListener("click", accountClick);
