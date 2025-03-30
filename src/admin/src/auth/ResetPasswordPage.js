import { useState } from 'react';
import { useNotify, useRedirect } from 'react-admin';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import authProvider from './authProvider';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const notify = useNotify();
    const redirect = useRedirect();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await authProvider.resetPassword(password);
            notify("Đổi mật khẩu thành công!", { type: 'success' });
            localStorage.removeItem("resetToken");
            redirect('/');
        } catch (err) {
            notify(err.message || "Đặt lại mật khẩu thất bại", { type: 'error' });
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5">Đặt lại mật khẩu</Typography>
                <form onSubmit={handleReset}>
                    <TextField
                        label="Mật khẩu mới"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" variant="contained" fullWidth>
                        Đặt lại mật khẩu
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default ResetPasswordPage;
