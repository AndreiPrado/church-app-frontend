import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../src/components/home/home.component.jsx';
import SignUp from '../src/components/signup/signup.component.jsx';
import SignupSuccess from '../src/components/signup/signup-success.component.jsx';

const Router = () => {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signup/success" element={<SignupSuccess />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;
