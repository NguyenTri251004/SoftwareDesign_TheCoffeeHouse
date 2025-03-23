import { Admin, Resource } from 'react-admin';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdminApp from './superadmin/index';
import AdminApp from './admin/index';


import ForgotPasswordPage from './auth/ForgotPasswordPage';
import VerifyResetCodePage from './auth/VerifyResetCodePage';
import ResetPasswordPage from './auth/ResetPasswordPage';
import EmailVerifyPage from './auth/EmailVerifyPage';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-reset-code" element={<VerifyResetCodePage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<EmailVerifyPage />} />

                <Route path="/*" element={<SuperAdminApp />} />
            </Routes>
        </BrowserRouter>
    );
};


export default App;