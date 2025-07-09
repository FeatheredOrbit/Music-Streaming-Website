export default function playIntroReversed(ref1, ref2) {
            if (ref1.current) { 
                ref1.current.offsetHeight;
                ref1.current.src = "assets/shared/foreground/intro_reversed.gif?t=" + Date.now();
            }

            if (ref2.current) {
                ref2.current.offsetHeight;
                ref2.current.src = "assets/shared/foreground/intro_reversed_shadowless.gif?t=" + Date.now();
                }
        }