import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import authProvider from './authProvider';

const EmailVerifyPage = () => {
    const location = useLocation();
    const [status, setStatus] = useState("Đang xác minh...");

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');

        authProvider.verifyEmail(token)
            .then(() => setStatus("Xác minh email thành công! Bạn có thể đăng nhập."))
            .catch((err) => setStatus(err.message || "Xác minh thất bại."));
    }, [location]);

    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
            <Typography variant="h6">{status}</Typography>
        </Box>
    );
};

export default EmailVerifyPage;
