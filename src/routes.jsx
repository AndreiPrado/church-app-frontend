import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './login/login.component.jsx';
import Home from './home/home.component.jsx';
import Welcome from "./welcome/welcome.component.jsx";
import Una from "./una/una.component.jsx";

const Router = () => {
    return(
        <BrowserRouter>
        
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/welcome" element={<Welcome/>}/>
            <Route path="/una" element={<Una/>}/>
        </Routes>
        </BrowserRouter>
   )
}

export default Router;
