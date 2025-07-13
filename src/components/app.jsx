import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import * as React from 'react';
import Home from './pages/home';
import Signup from './pages/signup';

export default function App() {
  const navigate = useNavigate();

  const introRef = useRef(null);
  const introShadowlessRef = useRef(null);

  const [introKey, setIntroKey] = React.useState(0);

  

  return (

    <>

      <div key={introKey} style={{ overflow: "hidden" }}>
          <video className="intro intro-shadow" ref={introRef} src="assets/shared/foreground/intro.mp4" />
          <video className="intro" ref={introShadowlessRef} src="assets/shared/foreground/intro_shadowless.mp4" />
      </div>
      

        <Routes>
          <Route path="/" element={<Home  />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

    </>
  );
}

