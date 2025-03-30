import { useState } from 'react';
import { useNotify, useRedirect } from 'react-admin';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import authProvider from './authProvider';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const notify = useNotify();
    const redirect = useRedirect();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await authProvider.sendForgotPasswordEmail(email);
            localStorage.setItem("resetToken", token);
            redirect('/verify-reset-code');
        } catch (err) {
            notify(err.message || "Có lỗi xảy ra", { type: 'error' });
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5">Quên mật khẩu</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" variant="contained" fullWidth>
                        Gửi mã đặt lại
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default ForgotPasswordPage;
