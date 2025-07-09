import React, { useEffect, useRef } from "react";

export default function useIntroRecache() {
    const introRef = useRef(null);
    const introShadowlessRef = useRef(null);
    const reverseIntroRef = useRef(null);
    const reverseIntroShadowlessRef = useRef(null);

    useEffect(function() {
        // Set image sources with timestamp to avoid caching
        if (introRef.current) {
            introRef.current.src = "assets/shared/foreground/intro.gif?t=" + Date.now();
        }
        if (introShadowlessRef.current) {
            introShadowlessRef.current.src = "assets/shared/foreground/intro_shadowless.gif?t=" + Date.now();
        }
    }, []);

    return { introRef, introShadowlessRef, reverseIntroRef, reverseIntroShadowlessRef };
}