import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './routes';
import './index.css';
import "@fontsource/lato";       // peso padrão (400)
import "@fontsource/lato/700.css"; // peso 700 (bold)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
