import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "pages/auth/login/LoginPage.js";
import SignUp from "pages/auth/signup/SignUpPage.js";
import VerifyEmail from "pages/auth/signup/Verify.js";
import ForgotPassword from "pages/auth/forgotPw/ForgotPassword.js";
import PasswordReset from "pages/auth/forgotPw/PasswordReset.js";
import SetNewPassword from "pages/auth/forgotPw/SetNewPassword.js";
import HomePage from "pages/homepage/HomePage.js";
import ShopListPage from "pages/shop/ShopListPage";
import ShopDetailPage from "pages/shop/DetailShop";

import './App.css';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/set-new-password" element={<SetNewPassword />} />

                <Route path="/shop/list" element={<ShopListPage />} />
                <Route path="/shop/detail/:_id" element={<ShopDetailPage />} />
                
            </Routes>
            
        </Router>
    );
}

export default App;
