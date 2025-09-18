import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../src/components/home/home.component.jsx';
import SignUp from '../src/components/signup/signup.component.jsx';

const Router = () => {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;
