import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './routes';
import './index.css';
import "@fontsource/lato";       // peso padrão (400)
import "@fontsource/lato/700.css"; // peso 700 (bold)
import { ParallaxProvider } from 'react-scroll-parallax';
import { AuthProvider } from './contexts/AuthContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ParallaxProvider scrollAxis="vertical">
        <Router />
      </ParallaxProvider>
    </AuthProvider>
  </React.StrictMode>
);
