import { useState } from 'react';
import { useNotify, useRedirect } from 'react-admin';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import authProvider from './authProvider';

const VerifyResetCodePage = () => {
    const [code, setCode] = useState('');
    const notify = useNotify();
    const redirect = useRedirect();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("resetToken");
            await authProvider.verifyResetCode(code, token);

            redirect('/reset-password');
        } catch (err) {
            notify(err.message || "Xác minh thất bại", { type: 'error' });
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5">Nhập mã xác nhận</Typography>
                <form onSubmit={handleVerify}>
                    <TextField
                        label="Mã xác nhận"
                        fullWidth
                        margin="normal"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <Button type="submit" variant="contained" fullWidth>
                        Tiếp tục
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default VerifyResetCodePage;
