// Root component that manages global state and routing.
// The transition animation works by cycling through a sequence of images forward or backward.
// This creates a frame by frame effect that hides content changes during navigation (gifs didn't work properlu).
// All animation frames are preloaded to avoid gaps where the background becomes visible.

import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import * as React from "react";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Account from "./pages/account";
import Library from "./pages/library";
import SongPosting from "./pages/song_posting";
import SongOverlay from "./other/song_overlay";

export default function App() {
  const navigate = useNavigate();

  // Prevents multiple navigation attempts while an animation is playing.
  const [transitioning, setTransitioning] = React.useState(false);

  // Stores the song currently being played. Also used to hide the overlay when empty.
  const [playingSongData, setPlayingSongData] = React.useState({
    songId: ""
  });

  // Milliseconds between each frame of the transition animation.
  const introDelay = 30;

  // Sequence of images for the transition effect with a "shadow" overlay, if we can call it that.
  const intro = [
    "assets/shared/foreground/intro/intro-0.png",
    "assets/shared/foreground/intro/intro-1.png",
    "assets/shared/foreground/intro/intro-2.png",
    "assets/shared/foreground/intro/intro-3.png",
    "assets/shared/foreground/intro/intro-4.png",
    "assets/shared/foreground/intro/intro-5.png",
    "assets/shared/foreground/intro/intro-6.png",
    "assets/shared/foreground/intro/intro-7.png",
    "assets/shared/foreground/intro/intro-8.png",
    "assets/shared/foreground/intro/intro-9.png",
    "assets/shared/foreground/intro/intro-10.png",
    "assets/shared/foreground/intro/intro-11.png",
    "assets/shared/foreground/intro/intro-12.png",
    "assets/shared/foreground/intro/intro-13.png",
    "assets/shared/foreground/intro/intro-14.png"
  ];

  // Same sequence without the shadow overlay, I honestly don't remember why I had 2 copies, I don't want to find out.
  const introShadowless = [
    "assets/shared/foreground/intro_shadowless/intro_shadowless-0.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-1.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-2.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-3.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-4.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-5.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-6.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-7.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-8.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-9.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-10.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-11.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-12.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-13.png",
    "assets/shared/foreground/intro_shadowless/intro_shadowless-14.png"
  ];

  const introRef = useRef(null);
  const introShadowlessRef = useRef(null);

  // Plays the transition animation. When reverse is true, it plays backwards.
  function playIntro(reverse) {
    const max = 14;
    const min = 0;

    
    if (reverse) {
      for (let i = max; i >= min; i--) {
        setTimeout(function() {
          if (introRef.current) {
            introRef.current.src = intro[i];
          }

          if (introShadowlessRef.current) {
            introShadowlessRef.current.src = introShadowless[i];
          }

        } , introDelay * (max - i));
      }
    } else {
      for (let i = min; i <= max; i++) {
        setTimeout(function() {
          if (introRef.current) {
            introRef.current.src = intro[i];
          }

          if (introShadowlessRef.current) {
            introShadowlessRef.current.src = introShadowless[i];
          }

        } , introDelay * i);
      }
    }
  }

  // Handles navigation between pages. Plays the transition animation before changing routes.
  function onNavigate(route) {
    if (location.pathname === route || transitioning) {
      return;
    }

    setTransitioning(true);
    playIntro(true);

    setTimeout(function() {
      navigate(route);
      playIntro(false);
    }, 550);

    setTimeout(function() {
      setTransitioning(false);
    }, introDelay * 30);
  }

  // Runs once when the app loads. Initializes the database and plays the intro animation.
  useEffect(function() {
    fetch("api/Music-Streaming-Website/back-end/database-initiation/init.php")
    .then(response => response.text())
    .then(data => {
      console.log("init.php: ", data);
    });

    playIntro(false);
  }, []);

  return (

    <>

      <div style={{ overflow: "hidden" }}>
        <img className="intro intro-shadow" ref={introRef} />
        <img className="intro" ref={introShadowlessRef} />
      </div>

      
      {playingSongData.songId && (
        <SongOverlay 
          key={playingSongData.songId}
          playingSongData={playingSongData} 
          setPlayingSongData={setPlayingSongData}
          onNavigate={onNavigate}
        />
      )}
      

      <Routes>
        <Route path="/" 
          element={<Home onNavigate={ onNavigate } 
          transitioning={ transitioning } 
          playingSongData={playingSongData} 
          setPlayingSongData={setPlayingSongData} />} 
        />

        <Route path="/signup" element={<Signup onNavigate={ onNavigate } transitioning={ transitioning } />} />
        <Route path="/login" element={<Login onNavigate={ onNavigate} transitioning={ transitioning } />} />

        <Route 
          path="/library" 
          element={<Library onNavigate={ onNavigate } 
          transitioning={ transitioning } 
          playingSongData={playingSongData}
          setPlayingSongData={setPlayingSongData}/>}
        />
        <Route path="/song-posting" element={<SongPosting onNavigate={ onNavigate } transitioning={ transitioning } />} />

        <Route path="/account" element={<Account onNavigate={ onNavigate } transitioning={ transitioning } />} />
      </Routes>

    </>
  );
}