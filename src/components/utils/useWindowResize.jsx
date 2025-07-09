import React, { useEffect} from "react";

export default function useWindowResize() {
    useEffect(function() {

        function handleResize() {
            document.documentElement.style.setProperty("--window-width", window.innerWidth + "px");
            document.documentElement.style.setProperty("--window-height", window.innerHeight + "px");

            document.documentElement.style.setProperty("--webpage-width", document.documentElement.scrollWidth + "px");
            document.documentElement.style.setProperty("--webpage-height", document.documentElement.scrollHeight + "px");
        }
        
        handleResize(); // Initial call to set properties on mount
        window.addEventListener("resize", handleResize);

        return function() {window.removeEventListener("resize", handleResize);};

    }, []);
 
}