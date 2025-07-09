import { Routes, Route, useNavigate } from 'react-router-dom';
import useIntroRecache from './utils/useIntroRecache';
import * as React from 'react';
import Home from './pages/home';
import Signup from './pages/signup';

export default function App() {
  const [loading, setLoading] = React.useState();
  const navigate = useNavigate();

  const { introRef, introShadowlessRef, reverseIntroRef, reverseIntroShadowlessRef } = useIntroRecache(); 

  function handlePageChange(path) {
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

    setLoading(true);
    setTimeout(function() {
      navigate(path);
      setLoading(false);
    }, 2000);
  }


  return (

    <>

      {loading &&
      <div>
          <img className="intro intro-shadow" ref={introRef} />
          <img className="intro" ref={introShadowlessRef} />

          <img id="intro_reversed" className="intro intro-shadow" ref={reverseIntroRef} />
          <img id="intro-shadowless_reversed" className="intro" ref={reverseIntroShadowlessRef} />
      </div>
      }

        <Routes>
          <Route path="/" element={<Home onNavigate={ handlePageChange } />} />
          <Route path="/signup" element={<Signup onNavigate={ handlePageChange } />} />
        </Routes>

    </>
  );
}

