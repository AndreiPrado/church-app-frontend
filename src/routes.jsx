import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../src/components/home/home.component.jsx';
import SignUp from '../src/components/signup/signup.component.jsx';
import SignupSuccess from '../src/components/signup/signup-success.component.jsx';
import Login from '../src/components/login/login.component.jsx';
import ResetPassword from '../src/components/reset-password/reset-password.component.jsx';
import Dashboard from '../src/components/dashboard/dashboard.component.jsx';
import MembersList from '../src/components/members-list/members-list.component.jsx';
import Approvals from '../src/components/approvals/approvals.component.jsx';
import Profile from '../src/components/profile/profile.component.jsx';
import PrivacyPolicy from '../src/components/privacy-policy/privacy-policy.component.jsx';
import TermsOfService from '../src/components/terms-of-service/terms-of-service.component.jsx';
import ProtectedRoute from '../src/components/protected-route/protected-route.component.jsx';
import ScrollToTop from '../src/components/scroll-to-top/scroll-to-top.component.jsx';

const Router = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signup/success" element={<SignupSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />

                {/* Rotas Administrativas Protegidas */}
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/members" 
                    element={
                        <ProtectedRoute>
                            <MembersList />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/approvals" 
                    element={
                        <ProtectedRoute>
                            <Approvals />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/profile" 
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;
