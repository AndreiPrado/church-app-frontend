import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home/home.component.jsx';

const Router = () => {
    return(
        <BrowserRouter>
        
        <Routes>
            <Route path="/" element={<Home/>} />
            {/* <Route path="/login" element={<Login/>}/> */}
        </Routes>
        </BrowserRouter>
   )
}

export default Router;
