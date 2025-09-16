import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './routes';
import './index.css';
import "@fontsource/lato";       // peso padrão (400)
import "@fontsource/lato/700.css"; // peso 700 (bold)
import { ParallaxProvider } from 'react-scroll-parallax';

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ParallaxProvider>
      <Router />
    </ParallaxProvider>
  </React.StrictMode>
);
