import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import SuperAdminApp from './superadmin/index';
import AdminApp from './admin/index';
import LoginPage from './auth/LoginPage';
import ForgotPasswordPage from './auth/ForgotPasswordPage';
import VerifyResetCodePage from './auth/VerifyResetCodePage';
import ResetPasswordPage from './auth/ResetPasswordPage';
import EmailVerifyPage from './auth/EmailVerifyPage';

const queryClient = new QueryClient();

const App = () => {
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            const newRole = localStorage.getItem('role');
            setRole(newRole);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (loading) return <div>Đang tải...</div>;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage setRole={setRole} />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/verify-reset-code" element={<VerifyResetCodePage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/verify-email" element={<EmailVerifyPage />} />

                    <Route
                        path="/*"
                        element={
                            role === 'superAdmin' ? (
                                <SuperAdminApp />
                            ) : role === 'admin' ? (
                                <AdminApp />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
        </LocalizationProvider>
    );
};

export default App;
