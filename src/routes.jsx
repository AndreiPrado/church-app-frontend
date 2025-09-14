import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home/home.component.jsx';
import SingUp from './singup/singup.component.jsx';

const Router = () => {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/sing-up" element={<SingUp />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;
