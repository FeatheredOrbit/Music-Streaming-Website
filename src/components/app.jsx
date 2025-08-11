import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import * as React from 'react';
import Home from './pages/home';
import Signup from './pages/signup';
import Login from './pages/login';

export default function App() {
  const navigate = useNavigate();

  const [transitioning, setTransitioning] = React.useState(false);

  const introDelay = 30;

  const intro = ["assets/shared/foreground/intro/intro-0.png",
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

  const introShadowless = ["assets/shared/foreground/intro_shadowless/intro_shadowless-0.png",
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

  useEffect(function() {
    fetch("api/Website/back-end/database-initiation/init.php")
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
      

        <Routes>
          <Route path="/" element={<Home onNavigate={ onNavigate } transitioning={ transitioning } />} />
          <Route path="/signup" element={<Signup onNavigate={ onNavigate } transitioning={ transitioning } />} />
          <Route path="/login" element={<Login onNavigate={ onNavigate} transitioning={ transitioning } />} />
        </Routes>

    </>
  );
}

